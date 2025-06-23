import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/Register.module.css";
import { jobOfferService, companyService } from "../../services/api";
import useAlerts from "../../hooks/useAlert";
import { useAuth } from "../../features/auth/AuthContext"; // 1. Importamos el hook de autenticación

export const CrearOferta = ({ onOfertaCreada }) => {
  // --- Estados del formulario ---
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [modalidad, setModalidad] = useState("Presencial");
  const [salario, setSalario] = useState("");
  const [horas_diarias, setHorasDiarias] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  
  // --- Estados de lógica ---
  const [empresasDelUsuario, setEmpresasDelUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  // 2. Obtenemos el usuario y su rol desde el contexto
  const { user, isAdmin } = useAuth();

  // 3. El useEffect ahora depende de 'user' y es mucho más seguro y eficiente
  useEffect(() => {
    // Solo buscamos las empresas si tenemos un usuario y es admin
    if (user && isAdmin) {
      const fetchEmpresas = async () => {
        try {
          const response = await companyService.getAllCompanies();
          setEmpresasDelUsuario(response.data);
          if (response.data.length === 0) {
            showToast(
              "warning",
              "Sin Empresas",
              "Necesitas registrar una empresa antes de poder crear una oferta."
            );
          }
        } catch (error) {
          showToast("error", "Error", "No se pudieron cargar tus empresas.");
          console.error("Error al cargar empresas:", error);
        }
      };
      fetchEmpresas();
    }
  }, [user, isAdmin, showToast]); // Dependemos de user e isAdmin para ejecutar la lógica

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setUbicacion("");
    setModalidad("Presencial");
    setSalario("");
    setHorasDiarias("");
    setEmpresaId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      showToast("error", "Acceso Denegado", "Solo los administradores pueden crear ofertas.");
      return;
    }
    if (!empresaId) {
      showToast("error", "Campo Requerido", "Debes seleccionar una empresa.");
      return;
    }

    setLoading(true);
    showLoadingAlert("Creando oferta...", "Por favor espera.");

    try {
      const offerData = {
        titulo,
        descripcion,
        ubicacion,
        modalidad,
        salario: parseFloat(salario) || 0,
        horas_por_dia: parseInt(horas_diarias) || 0,
        id_empresa: empresaId,
        user_id: user.id, // Usamos el ID del usuario del contexto
      };

      await jobOfferService.createJobOffer(offerData);

      closeAlert();
      showToast(
        "success",
        "¡Oferta Creada!",
        "La oferta ha sido publicada con éxito."
      );
      
      if (onOfertaCreada) {
        onOfertaCreada(); 
      }
      limpiarFormulario();
    } catch (error) {
      closeAlert();
      const errorMessage =
        error.response?.data?.message ||
        "Hubo un problema al crear la oferta. Inténtalo de nuevo.";
      showToast("error", "Error", errorMessage);
      console.error(
        "Error al crear oferta en el componente:",
        error.response?.data || error.message || error
      );
    } finally {
      setLoading(false);
    }
  };

  // 4. Si el usuario no es admin, mostramos un mensaje y no el formulario.
  if (!isAdmin) {
    return (
        <div className={styles.registerContainer} style={{ marginTop: "40px" }}>
            <div className={styles.registerCard}>
                <h2 className={styles.registerTitle}>Crear Nueva Oferta</h2>
                <p className="text-center" style={{color: '#ffc107'}}>
                    No tienes permisos de administrador para acceder a esta sección.
                </p>
            </div>
        </div>
    );
  }

  return (
    <div
      className={styles.registerContainer}
      style={{ color: "white", marginTop: "40px" }}
    >
      <div className={styles.registerCard} style={{ color: "white" }}>
        <h2 className={styles.registerTitle} style={{ color: "white" }}>
          Crear Nueva Oferta
        </h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.formColumns}>
            {/* --- COLUMNA IZQUIERDA --- */}
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <input
                  id="oferta-titulo"
                  type="text"
                  className={styles.inputField}
                  placeholder="Título de la Oferta (ej. Desarrollador Frontend)"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  disabled={loading}
                  style={{ color: "white" }}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="oferta-ubicacion"
                  type="text"
                  className={styles.inputField}
                  placeholder="Ubicación (ej. Madrid, España)"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  required
                  disabled={loading}
                  style={{ color: "white" }}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="oferta-salario"
                  type="number"
                  step="100"
                  className={styles.inputField}
                  placeholder="Salario (Anual Bruto)"
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                  required
                  disabled={loading}
                  style={{ color: "white" }}
                />
              </div>

              <div className={styles.inputGroup}>
                <select
                  id="oferta-empresa"
                  className={styles.inputField}
                  value={empresaId}
                  onChange={(e) => setEmpresaId(e.target.value)}
                  required
                  disabled={loading}
                  style={{ color: "white" }}
                >
                  <option value="" disabled>
                    Selecciona una empresa
                  </option>
                  {empresasDelUsuario.map((empresa) => (
                    <option
                      key={empresa._id}
                      value={empresa._id}
                      style={{ color: "black" }}
                    >
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* --- COLUMNA DERECHA --- */}
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <textarea
                  id="oferta-descripcion"
                  className={styles.inputField}
                  placeholder="Descripción detallada del puesto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  disabled={loading}
                  rows="4"
                  style={{ color: "white" }}
                ></textarea>
              </div>

              <div className={styles.inputGroup}>
                <select
                  id="oferta-modalidad"
                  className={styles.inputField}
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                  required
                  disabled={loading}
                  style={{ color: "white" }}
                >
                  <option value="Presencial" style={{ color: "black" }}>
                    Presencial
                  </option>
                  <option value="Remota" style={{ color: "black" }}>
                    Remota
                  </option>
                  <option value="Híbrida" style={{ color: "black" }}>
                    Híbrida
                  </option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="oferta-horas"
                  type="number"
                  className={styles.inputField}
                  placeholder="Horas al día"
                  value={horas_diarias}
                  onChange={(e) => setHorasDiarias(e.target.value)}
                  required
                  disabled={loading}
                  style={{ color: "white" }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading || empresasDelUsuario.length === 0}
            style={{ color: "white" }}
          >
            {loading ? "Publicando Oferta..." : "Crear Oferta"}
          </button>
        </form>
        <div className={styles.loginPrompt} style={{ color: "white" }}>
          <a
            href="/ofertas"
            className={styles.loginLink}
            style={{ color: "var(--link-color)" }}
          >
            Volver a la lista de ofertas
          </a>
        </div>
      </div>
    </div>
  );
};