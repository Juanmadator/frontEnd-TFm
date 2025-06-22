import { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faClock, faMapMarkerAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import styles from './CardOfertaTrabajo.module.css';
import { jobOfferService } from '../../services/api';
import useAlerts from '../../hooks/useAlert';
import logoImagen from '../../assets/images/logo.jpeg';

function CardOfertaTrabajo({ oferta, onOfferDeleted }) {
  const { t } = useTranslation();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setLoggedInUserId(user.id);
    }
  }, []);
  
  if (!oferta) {
    return null; 
  }

  const handleApply = () => {
    console.log(`Aplicar a oferta ${oferta.id} de ${oferta.id_empresa?.nombre}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(t('¿Estás seguro de que quieres eliminar esta oferta?'))) {
      return;
    }

    setIsDeleting(true);
    showLoadingAlert(t('Eliminando oferta...'), t('Por favor, espera.'));

    try {
      await jobOfferService.deleteJobOffer(oferta._id);
      closeAlert();
      showToast('success', t('¡Éxito!'), t('Oferta eliminada correctamente.'));
      if (onOfferDeleted) {
        onOfferDeleted(oferta._id);
      }
    } catch (error) {
      closeAlert();
      showToast('error', t('Error'), error.response?.data?.message || t('Hubo un problema al eliminar la oferta.'));
      console.error('Error al eliminar oferta:', error.response?.data || error.message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const isOwner = loggedInUserId && loggedInUserId === oferta.user_id;
  
  const companyName = oferta.id_empresa?.nombre || t('Empresa no especificada');
  const tituloOferta = oferta.titulo || t('Indefinido');
  const companyLogo = oferta.id_empresa?.url_logo || defaultCompanyLogo;
  const salaryText = oferta.salario ? `${oferta.salario} €` : t('Indefinido');
  const modalityText = oferta.modalidad || t('Indefinido');
  const hoursText = oferta.horas_por_dia ? `${oferta.horas_por_dia} ${t('horas / día')}` : t('Indefinido');
  const locationText = oferta.ubicacion || t('Desubicado');
  const descriptionText = oferta.descripcion || t('Sin descripción.');
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const publicationDate = formatDate(oferta.createdAt);

  return (
    <Card className={styles.cardContainer}>
      <Card.Body className={styles.cardBody}>
        <Row className="align-items-start">
          <Col xs={12} md={8} className={styles.leftColumn}>
            <div className={styles.companyHeader}>
              <img src={logoImagen} alt={`${companyName} Logo`} className={styles.companyLogo} />
              <Card.Title className={styles.companyName}>{tituloOferta}</Card.Title>
            </div>
            <Card.Text className={styles.description}>
              {descriptionText}
            </Card.Text>
            <div className={styles.footerInfo}>
              <span className={styles.viewMoreLink}>{companyName}</span>
              <span className={styles.timeAgo}>{publicationDate}</span>
            </div>
          </Col>
          <Col xs={12} md={4} className={styles.rightColumn}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailBox}>
                <FontAwesomeIcon icon={faWifi} className={styles.icon} /> <span>{modalityText}</span>
              </div>
              <div className={styles.detailBox}>
                <FontAwesomeIcon icon={faClock} className={styles.icon} /> <span>{hoursText}</span>
              </div>
              <div className={styles.detailBox}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} /> <span>{locationText}</span>
              </div>
              <div className={styles.detailBox}>
                 <FontAwesomeIcon icon={faBuilding} className={styles.icon} /> <span>{salaryText}</span>
              </div>
            </div>
            <Button variant="primary" className={styles.applyButton} onClick={handleApply}>
              {t('Aplicar')}
            </Button>
            {isOwner && (
              <Button
                variant="danger"
                className={`${styles.applyButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t('Eliminando...') : t('Eliminar')}
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CardOfertaTrabajo;
