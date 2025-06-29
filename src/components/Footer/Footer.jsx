import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footerContainer}>
      <Container className={styles.footerContentWrapper}>
        <Row>
          <Col xs={12} md={3} className={styles.footerColumn}>
            <h5 className={styles.columnTitle}>{t('Sobre nosotros')}</h5>
            <ul className={styles.footerLinks}>
              <li>
               <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('¿Por qué nosotros?')} 
                </a>
              </li>
              <li>
               <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('Conócenos')} 
                </a>
              </li>
            </ul>
          </Col>

          {/* Column 2: Politica */}
          <Col xs={12} md={3} className={`${styles.footerColumn} ${styles.columnDivider}`}>
            <h5 className={styles.columnTitle}>{t('Politica')}</h5>
            <ul className={styles.footerLinks}>
              <li>
               <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('FAQ')} 
                </a>
              </li>
              <li>
                <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('Politica de privacidad')} 
                </a>
              </li>
              <li>
               <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('Linkedin')} 
                </a>
              </li>
            </ul>
          </Col>

          {/* Column 3: About Us (Duplicated in image, could be different category) */}
          <Col xs={12} md={3} className={`${styles.footerColumn} ${styles.columnDivider}`}>
            <h5 className={styles.columnTitle}>{t('Sobre nosotros')}</h5> {/* Duplicated as per image */}
            <ul className={styles.footerLinks}>
              <li>
               <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('Nosotros')} 
                </a>
              </li>
              <li>
              <a href="https://evolveacademy.es" className={styles.footerLink}>
                  {t('Instagram')} 
                </a>
              </li>
            </ul>
          </Col>

          {/* Column 4: JOB-DAY & Social Icons */}
          <Col xs={12} md={3} className={styles.socialColumn}>
            <div className={styles.socialContent}>
              <h4 className={styles.jobDayText}>JOB-DAY</h4>
              <div className={styles.socialIcons}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;