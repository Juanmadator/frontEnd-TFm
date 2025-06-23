import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useAuth } from '../../features/auth/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faUserCircle,
  faPlusCircle,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import styles from "./Profile.module.css";
import useAlerts from "../../hooks/useAlert";
import { userService, uploadsService } from "../../services/api";
import OfertasTrabajoPageProfile from "../../pages/OfertasTrabajoPageProfile";

function Perfil() {
  const { t } = useTranslation();
  const { user, logout, loading, isAdmin } = useAuth();
  const { showToast, showLoadingAlert, closeAlert, showEditProfileModal } = useAlerts();

  const [userData, setUserData] = useState({
    nombre: "",
    nacimiento: "",
    estadoActual: "",
    correo: "",
    imageUrl: "https://via.placeholder.com/200/cccccc/000000?text=Cargando...",
    curriculumUrl: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      const storedUser = user;

      if (storedUser && storedUser.id) {
        try {
          const response = await userService.getUserById(storedUser.id);
          const fetchedUser = response.data;

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

    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    if (!userId) {
        showToast("error", t("Error"), t("ID de usuario no disponible para subir la imagen."));
        return;
    }

    if (!file.type.startsWith("image/")) { /* ... */ }

    setIsUploadingImage(true);
    showLoadingAlert(t("Subiendo imagen de perfil..."), t("Esto puede tardar un momento."));
    try {
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

  const handleUploadCV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    if (!userId) {
        showToast("error", t("Error"), t("ID de usuario no disponible para subir el currículum."));
        return;
    }

    if (file.type !== "application/pdf") { /* ... */ }

    setIsUploadingResume(true);
    showLoadingAlert(t("Subiendo currículum..."), t("Esto puede tardar un momento."));
    try {
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

  const handleDownloadCV = () => {
    if (userData.curriculumUrl) {
      window.open(userData.curriculumUrl, "_blank");
    } else {
      showToast("info", t("Información"), t("No hay un currículum subido para descargar."));
    }
  };

  const handleEditData = async () => {
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
                nacimiento: formValues.nacimiento,
                estado: formValues.estado,
            });

            setUserData(prev => ({
                ...prev,
                nombre: updatedUserResponse.data.nombre,
                nacimiento: updatedUserResponse.data.nacimiento,
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
      <Container className={styles.perfilContentWrapper}>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} md={4} className={styles.imageColumn}>
            <div className={styles.imageWrapper}>
              <img
                src={userData.imageUrl}
                alt="Profile"
                className={styles.profileImage}
              />
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
          <Col xs={12} md={6} className={styles.dataColumn}>
            <div className={styles.dataBox}>
              <p>
                <strong>{t("Nombre")}:</strong> {userData.nombre}
              </p>
              <p>
                <strong>{t("Nacimiento")}:</strong> 
                 {userData.nacimiento &&
                  new Date(userData.nacimiento).toLocaleDateString(t('es'), {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
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
      <Container>
      <OfertasTrabajoPageProfile mostrarFormulario={ false} ></OfertasTrabajoPageProfile>
      </Container>
    </Container>
  );
}

export  {Perfil};
