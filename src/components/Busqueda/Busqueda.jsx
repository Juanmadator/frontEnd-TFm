// src/components/Busqueda/Busqueda.jsx

import React from 'react'; // Eliminamos useState porque ya no lo necesitamos aquí
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import styles from './Busqueda.module.css';

// 1. Recibimos las props 'filtros' y 'onFiltroChange' desde el padre (Home.jsx)
function Busqueda({ filtros, onFiltroChange }) {
  const { t } = useTranslation();

  // 2. Eliminamos los estados locales (useState). El estado ahora lo controla Home.
  // const [jobTitle, setJobTitle] = useState('');
  // const [location, setLocation] = useState('');

  const commonSearches = [
    t('Ingeniero de software'), t('Diseñador UX/UI'), t('Chef'), t('Mecánico'),
    t('Profesor'), t('Analista de datos'), t('Marketing digital'), t('Arquitecto'),
  ];

  // 3. Unificamos los manejadores de eventos en una sola función.
  // Esta función llamará a la prop 'onFiltroChange' para notificar al componente 'Home'.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFiltroChange({ [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ahora es en tiempo real, pero podemos dejar esto por si quieres añadir
    // alguna funcionalidad extra al botón en el futuro.
    console.log('Búsqueda activada con filtros:', filtros);
  };

  // 6. El clic en una búsqueda común ahora llama a onFiltroChange para actualizar el título en 'Home'
  const handleCommonSearchClick = (term) => {
    onFiltroChange({ titulo: term });
  };

  return (
    <Container fluid className={styles.color}>
      <Container fluid className={styles.jobSearchContainer}>
        <Row className="align-items-center justify-content-center">
          <Col md={7} className={styles.leftSection}>
            <div className={styles.heroContentWrapper}>
              <div className={styles.heroTextWrapper}>
                <h1 className={styles.heroText}>
                  {t('Buscas una oportunidad')}
                  <br />
                  ¡JOB-DAY {t('es tu lugar')}!
                </h1>
              </div>

              <Form onSubmit={handleSearch} className={styles.searchForm}>
                <InputGroup className={styles.searchInputGroup}>
                  <Form.Control
                    type="text"
                    placeholder={t('Encuentra tu trabajo ideal')}
                    // 4. Asignamos el valor desde las props y añadimos el atributo 'name'
                    name="titulo"
                    value={filtros.titulo} 
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                  <InputGroup.Text className={styles.locationIcon}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={t('Ubicación')}
                     // 5. Hacemos lo mismo para el campo de ubicación
                    name="ubicacion"
                    value={filtros.ubicacion}
                    onChange={handleInputChange}
                    className={styles.locationInput}
                  />
                  <Button type="submit" className={styles.searchButton}>
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Form>

              <a href="/profile" className={styles.updateCvLink}>
                {t('Actualiza tu CV')}
              </a>
            </div>
          </Col>

          <Col md={5} className={styles.rightSection}>
            <div className={styles.commonSearchesContentWrapper}>
              <div className={styles.commonSearchesHeader}>
                <h2 className={styles.commonSearchesTitle}>{t('Búsquedas comunes')}</h2>
              </div>
              <div className={styles.commonSearchesButtons}>
                {commonSearches.map((term, index) => (
                  <Button
                    key={index}
                    variant="primary"
                    className={styles.commonSearchButton}
                    onClick={() => handleCommonSearchClick(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Busqueda;