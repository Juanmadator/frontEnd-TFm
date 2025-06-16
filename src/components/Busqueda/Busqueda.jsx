import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import styles from './Busqueda.module.css';

function Busqueda() {
  const { t } = useTranslation();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const commonSearches = [
    t('Ingeniero de software'),
    t('Diseñador UX/UI'),
    t('Chef'),
    t('Mecánico'),
    t('Profesor'),
    t('Analista de datos'),
    t('Marketing digital'),
    t('Arquitecto'),
    t('Abogado'),
    t('Médico'),
  ];

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for job:', jobTitle, 'Location:', location);
    // Real API call or navigation
  };

  const handleCommonSearchClick = (term) => {
    console.log('Common search clicked:', term);
    setJobTitle(term); // Optionally pre-fill the search input
    // Real search trigger
  };

  return (
    <Container fluid className={styles.color}>
          <Container fluid className={styles.jobSearchContainer}>
                <Row className="align-items-center justify-content-center">
        {/* Left Section - Hero Text and Search Bar */}
        <Col md={7} className={styles.leftSection}>
          <div className={styles.heroContentWrapper}> {/* New wrapper for centering */}
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
                  value={jobTitle}
                  onChange={handleJobTitleChange}
                  className={styles.searchInput}
                />
                <InputGroup.Text className={styles.locationIcon}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t('Ubicación')}
                  value={location}
                  onChange={handleLocationChange}
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
          </div> {/* End heroContentWrapper */}
        </Col>

        {/* Right Section - Common Searches */}
        <Col md={5} className={styles.rightSection}>
          <div className={styles.commonSearchesContentWrapper}> {/* New wrapper for centering */}
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
          </div> {/* End commonSearchesContentWrapper */}
        </Col>
      </Row>

    </Container>
    </Container>
  );
}

export default Busqueda;