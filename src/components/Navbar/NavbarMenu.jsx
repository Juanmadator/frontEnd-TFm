import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import styles from './Navbarmenu.module.css'
import { useTranslation } from 'react-i18next';

function NavbarMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
 const { user, logout, loading, isAdmin } = useAuth();



  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <Navbar className={styles.navbar}  variant="dark" expand="lg" fixed="top" style={{ width: '100%', padding: '15px' }}>
      <Container>
        <Navbar.Brand as={NavLink} to="/">JOB-DAY</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/">
              {t("Menu")}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              {t("Perfil")}
            </Nav.Link>

               <Nav.Link as={NavLink} to="/empresas">
              {t("Empresas")}
            </Nav.Link>

                <Nav.Link as={NavLink} to="/ofertas">
              {t("Ofertas")}
            </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={handleLogout} className={`${styles.logout} ms-2`}>
              {t("Cerrar Sesión")}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;
