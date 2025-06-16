import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './Navbarmenu.module.css'
import { useTranslation } from 'react-i18next';

function NavbarMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = () => {
    if (localStorage.getItem('userToken')) {
      localStorage.removeItem('userToken');
      console.log('userToken eliminado de localStorage.');
    } else {
      console.log('userToken no encontrado en localStorage.');
    }

    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      console.log('user eliminado de localStorage.');
    } else {
      console.log('user no encontrado en localStorage.');
    }
    
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
              {t("menu")}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              {t("profile")}
            </Nav.Link>

               <Nav.Link as={NavLink} to="/empresas">
              {t("Companies")}
            </Nav.Link>

                <Nav.Link as={NavLink} to="/ofertas">
              {t("Ofertas")}
            </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={handleLogout} className={`${styles.logout} ms-2`}>
              {t("logout")}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;
