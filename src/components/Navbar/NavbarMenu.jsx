import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner"; // Importamos Spinner para el estado de carga
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext"; // Asegúrate que la ruta es correcta
import styles from "./Navbarmenu.module.css";
import { useTranslation } from "react-i18next";

function NavbarMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // 1. Obtenemos 'isAuthenticated' y 'loading' del contexto, además de 'user' y 'logout'
  const { user, logout, isAuthenticated, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Función para renderizar los botones de la derecha
  const renderAuthSection = () => {
    // Mientras el contexto está cargando (comprobando localStorage), mostramos un spinner
    if (loading) {
      return <Spinner animation="border" size="sm" variant="light" />;
    }

    // Si está autenticado, muestra el saludo y el botón de logout
    if (isAuthenticated) {
      return (
        <>
          {/* Opcional pero recomendado: Saludar al usuario */}
          <Navbar.Text className="me-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {t('Hola')}, {user.nombre}
          </Navbar.Text>
          <Button
            variant="outline-light"
            onClick={handleLogout}
            className={styles.logout}
          >
            {t("Cerrar Sesión")}
          </Button>
        </>
      );
    }

    // Si no está autenticado, muestra los botones de login y registro
    return (
      <>
        <Button
          as={NavLink}
          to="/login"
          variant="light"
          className="me-2"
        >
          {t("Iniciar Sesión")}
        </Button>
        <Button
          as={NavLink}
          to="/register"
          variant="outline-light"
        >
          {t("Registrarse")}
        </Button>
      </>
    );
  };

  return (
    <Navbar
      className={styles.navbar}
      variant="dark"
      expand="lg"
      fixed="top"
      style={{ width: "100%", padding: "15px" }}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          JOB-DAY
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/">
              {t("Menu")}
            </Nav.Link>
            {/* Opcional: Mostrar Perfil solo si está logueado */}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/profile">
                {t("Perfil")}
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/empresas">
              {t("Empresas")}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas">
              {t("Ofertas")}
            </Nav.Link>
          </Nav>
          
          {/* 2. Aquí llamamos a nuestra función de renderizado condicional */}
          <Nav>
            {renderAuthSection()}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;