import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import styles from './Busqueda.module.css';

function Busqueda({ filtros, onFiltroChange }) {
  const { t } = useTranslation();

  const commonSearches = [
    t('Ingeniero de software'), t('Diseñador UX/UI'), t('Chef'), t('Mecánico'),
    t('Profesor'), t('Analista de datos'), t('Marketing digital'), t('Arquitecto'),
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFiltroChange({ [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

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
