// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react"; // Importar useState y useEffect
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faUserCircle, // Asegúrate de que este y otros iconos que uses estén importados
  faPlusCircle, // Asegúrate de que este y otros iconos que uses estén importados
  faDownload, // Asegúrate de que este y otros iconos que uses estén importados
} from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";
import styles from "./Profile.module.css"; // Confirma si es Profile.module.css o Perfil.module.css
import useAlerts from "../../hooks/useAlert"; // Asumiendo que tienes este hook
import { userService, uploadsService } from "../../services/api"; // Importar los servicios

function Perfil() {
  const { t } = useTranslation();
  const { showToast, showLoadingAlert, closeAlert, showEditProfileModal } = useAlerts();

  // Estado para los datos del usuario, inicializado vacío y luego cargado de la API
  const [userData, setUserData] = useState({
    nombre: "",
    nacimiento: "",
    estadoActual: "",
    correo: "",
    imageUrl: "https://via.placeholder.com/200/cccccc/000000?text=Cargando...",
    curriculumUrl: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true); // Carga inicial del perfil
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Carga para subida de imagen
  const [isUploadingResume, setIsUploadingResume] = useState(false); // Carga para subida de CV

  // Efecto para cargar los datos completos del usuario al montar el componente
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser && storedUser.id) {
        try {
          const response = await userService.getUserById(storedUser.id);
          const fetchedUser = response.data;
          console.log("fetched",fetchedUser);

          setUserData({
            nombre: fetchedUser.nombre || t("N/A"),
            nacimiento: fetchedUser.nacimiento || t("N/A"),
            empleado: fetchedUser.empleado || t("N/A"),
            correo: fetchedUser.email || t("N/A"),
            imageUrl:
              fetchedUser.url_perfil_img ||
              "https://placehold.co/200x200/cccccc/000000?text=Sin+Imagen",
            curriculumUrl: fetchedUser.url_curriculum || "",
            id : storedUser.id
          });
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
          showToast("error", t("Error"), t("No se pudo cargar la información del perfil."));
        }
      } else {
        showToast("info", t("Información"), t("Por favor, inicia sesión para ver tu perfil."));
      }
      setLoadingProfile(false);
    };

    fetchUserProfile();
  }, []); 

const handleEditImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Obtener el userId del localStorage o del estado, si ya está cargado
    const userId = JSON.parse(localStorage.getItem('user'))?.id; // O userData.id si ya está en el estado
    if (!userId) {
        showToast("error", t("Error"), t("ID de usuario no disponible para subir la imagen."));
        return;
    }

    if (!file.type.startsWith("image/")) { /* ... */ }

    setIsUploadingImage(true);
    showLoadingAlert(t("Subiendo imagen de perfil..."), t("Esto puede tardar un momento."));
    try {
      // <--- CAMBIO AQUÍ: Pasar el userId
      const imageUrl = await uploadsService.uploadProfileImage(file, userId);
      setUserData((prev) => ({ ...prev, imageUrl }));
      showToast("success", t("¡Éxito!"), t("Imagen de perfil actualizada."));
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error);
      showToast("error", t("Error"), error.message || t("Error al subir la imagen de perfil."));
    } finally {
      setIsUploadingImage(false);
      closeAlert();
    }
  };

  // Handler para la subida del currículum (PDF) (MODIFICADO)
  const handleUploadCV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Obtener el userId del localStorage o del estado, si ya está cargado
    const userId = JSON.parse(localStorage.getItem('user'))?.id; // O userData.id si ya está en el estado
    if (!userId) {
        showToast("error", t("Error"), t("ID de usuario no disponible para subir el currículum."));
        return;
    }

    if (file.type !== "application/pdf") { /* ... */ }

    setIsUploadingResume(true);
    showLoadingAlert(t("Subiendo currículum..."), t("Esto puede tardar un momento."));
    try {
      // <--- CAMBIO AQUÍ: Pasar el userId
      const curriculumUrl = await uploadsService.uploadResume(file, userId);
      setUserData((prev) => ({ ...prev, curriculumUrl }));
      showToast("success", t("¡Éxito!"), t("Currículum subido y actualizado correctamente."));
    } catch (error) {
      console.error("Error al subir currículum:", error);
      showToast("error", t("Error"), error.message || t("Hubo un problema al subir el currículum."));
    } finally {
      setIsUploadingResume(false);
      closeAlert();
    }
  };

  // Handler para descargar el currículum
  const handleDownloadCV = () => {
    if (userData.curriculumUrl) {
      window.open(userData.curriculumUrl, "_blank");
    } else {
      showToast("info", t("Información"), t("No hay un currículum subido para descargar."));
    }
  };

  // Otros handlers (dummy por ahora, puedes implementar su lógica más tarde)
const handleEditData = async () => {
    // MODIFICACIÓN: Pasa userData.nacimiento como tercer parámetro
    const formValues = await showEditProfileModal(
        userData.nombre,
        userData.empleado,
        userData.nacimiento 
    );

    if (formValues) {
        showLoadingAlert(t('Actualizando datos...'), t('Por favor, espera.'));
        try {
            const updatedUserResponse = await userService.updateUser(userData.id, {
                nombre: formValues.nombre,
                // Asegúrate de que tu backend espera 'nacimiento' como un campo de fecha
                nacimiento: formValues.nacimiento, // Enviará la fecha en formato YYYY-MM-DD
                estado: formValues.estado,
            });

            setUserData(prev => ({
                ...prev,
                nombre: updatedUserResponse.data.nombre,
                nacimiento: updatedUserResponse.data.nacimiento, // Actualiza con la fecha formateada del backend si es diferente
                estadoActual: updatedUserResponse.data.estado,
            }));

            closeAlert();
            showToast('success', t('¡Éxito!'), t('Datos actualizados correctamente.'));
        } catch (error) {
            closeAlert();
            showToast('error', t('Error'), error.response?.data?.message || t('Hubo un problema al actualizar los datos.'));
            console.error('Error al actualizar datos:', error.response?.data || error.message);
        }
    }
};
  const handleAddExperience = () => console.log("Añadir Experiencia clicked");
  const handleAddStudy = () => console.log("Añadir Formación clicked");
  const handleAddLanguage = () => console.log("Añadir Idioma clicked");
  const handleAddOtherData = () => console.log("Añadir Otro Dato clicked");
  const handleViewMoreExperience = () => console.log("Ver más Experiencia clicked");

  // Muestra un estado de carga inicial si los datos del perfil aún no se han cargado
  if (loadingProfile) {
    return (
      <Container fluid className={styles.perfilContainer}>
        <div style={{ padding: "50px", textAlign: "center", color: "#555" }}>
          {t("Cargando perfil...")}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className={styles.perfilContainer}>
      {/* Main container with background */}
      <Container className={styles.perfilContentWrapper}>
        {/* Inner container for max-width and centering */}
        <Row className="justify-content-center align-items-center">
          {/* Left Column: Image and Edit Image Button */}
          <Col xs={12} md={4} className={styles.imageColumn}>
            <div className={styles.imageWrapper}>
              <img
                src={userData.imageUrl}
                alt="Profile"
                className={styles.profileImage}
              />
              {/* Input de archivo oculto para la imagen de perfil activado por el label */}
              <div className={styles.inputGroup}>
                <label
                  htmlFor="profile-image-upload"
                  className={`${styles.editImageButton} ${
                    isUploadingImage ? styles.uploading : ""
                  }`}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? t("Subiendo...") : t("Editar imagen")}
                  {!isUploadingImage && <FontAwesomeIcon icon={faPencilAlt} />}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  className={styles.hiddenFileInput}
                  onChange={handleEditImage}
                  disabled={isUploadingImage}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
            </div>
          </Col>

          {/* Right Column: Personal Data and Edit Data Button */}
          <Col xs={12} md={6} className={styles.dataColumn}>
            <div className={styles.dataBox}>
              <p>
                <strong>{t("Nombre")}:</strong> {userData.nombre}
              </p>
              <p>
                <strong>{t("Nacimiento")}:</strong> 

                 {userData.nacimiento && // Solo intenta formatear si la fecha existe
                  new Date(userData.nacimiento).toLocaleDateString(t('es'), { // Usa la clave 'es' de tu i18n o 'es-ES' directamente
                    year: 'numeric',
                    month: '2-digit', // 'long', 'short', '2-digit'
                    day: '2-digit',   // '2-digit'
                  })}
              </p>
              <p>
                <strong>{t("Estado actual")}:</strong> {userData.empleado}
              </p>
              <p>
                <strong>{t("Correo")}:</strong> {userData.correo}
              </p>
             
              <Button
                variant="primary"
                className={styles.editDataButton}
                onClick={handleEditData}
              >
                {t("Editar datos")} <FontAwesomeIcon icon={faPencilAlt} />
              </Button>
            </div>
          </Col>
        </Row>

        {/* Fila de botones de CV */}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={12} className={styles.cvButtonsColumn}>
            <div className={styles.cvButtonsWrapper}>
              <Button
                variant="primary"
                className={styles.cvButton}
                onClick={handleDownloadCV}
                disabled={!userData.curriculumUrl || isUploadingResume}
              >
                {t("Ver CV")}{" "}
                {userData.curriculumUrl && <FontAwesomeIcon icon={faDownload} />}
              </Button>
            
              {/* Botón para Subir CV (activa el input de archivo oculto) */}
              <div className={styles.inputGroup}>
                <label
                  htmlFor="cv-upload"
                  className={`${styles.cvButton} ${
                    isUploadingResume ? styles.uploading : ""
                  }`}
                  disabled={isUploadingResume}
                >
                  {isUploadingResume ? t("Subiendo...") : t("Subir CV")}
                </label>
                <input
                  id="cv-upload"
                  type="file"
                  className={styles.hiddenFileInput}
                  onChange={handleUploadCV}
                  disabled={isUploadingResume}
                  accept="application/pdf"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

        <Container className={styles.whiteSectionWrapper} style={{ padding: "50px", marginBottom: "20px" }}>
          <Row className="justify-content-center">
          <Col xs={12} md={6} className={styles.sectionCol}>
            <div className={styles.infoBox}>
              <div className={styles.infoBoxHeader}>
                <h3>{t("Experiencia laboral")}:</h3>
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className={styles.headerUserIcon}
                />
                <span
                  className={styles.addIcon}
                  onClick={handleAddExperience}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </span>
              </div>
              <p className={styles.companyName}>Coderit S.R.L</p>
              <ul className={styles.experienceList}>
                <li>Desarrollo de aplicaciones SpringBoot.</li>
                <li>Estudio básico de Docker</li>
                <li>Creación y modificación base de datos MySQL</li>
                <li>Control de versiones con Liquibase</li>
                <li>Desarrollo con dependencias Maven</li>
                <li>Implementación de principios como HATEOAS</li>
              </ul>
              <Button
                variant="outline-light"
                className={styles.viewMoreButton}
                onClick={handleViewMoreExperience}
              >
                {t("Ver más")}
              </Button>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxMarginTop}`}>
              <div className={styles.infoBoxHeader}>
                <h3>{t("Estudios")}:</h3>
                <span
                  className={styles.addIcon}
                  onClick={handleAddStudy}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </span>
              </div>
              <ul className={styles.studyList}>
                <li>Bachillerato tecnológico 2020-2022</li>
                <li>CFGS Desarrollo Aplicaciones Web 2022-2024</li>
              </ul>
            </div>
          </Col>

          {/* Second Column of the White Section (divided into two rows) */}
          <Col xs={12} md={6} className={styles.sectionCol}>
            <Row className="flex-grow-1">
              {/* First Row of Second Column */}
              <Col xs={12} className={styles.whiteRowTop}>
                <div className={styles.whiteColContent}>
                  <h3>{t("Formación Académica")}</h3>
                  <p>Aquí va tu formación...</p>
                  <Button
                    variant="primary"
                    className={styles.whiteSectionButton}
                    onClick={handleAddStudy}
                  >
                    {t("Añadir Formación")} <FontAwesomeIcon icon={faPencilAlt} />
                  </Button>
                </div>
              </Col>
              {/* Second Row of Second Column */}
              <Col xs={12} className={styles.whiteRowBottom}>
                <div className={styles.whiteColContent}>
                  <h3>{t("Habilidades")}</h3>
                  <p>Aquí van tus habilidades...</p>
                  <Button
                    variant="primary"
                    className={styles.whiteSectionButton}
                    onClick={handleAddOtherData}
                  >
                    {t("Añadir Habilidades")} <FontAwesomeIcon icon={faPencilAlt} />
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export  {Perfil};