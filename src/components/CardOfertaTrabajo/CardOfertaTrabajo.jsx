import { useState } from 'react';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faClock, faMapMarkerAlt, faBuilding, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import styles from './CardOfertaTrabajo.module.css';

import { applicationService, jobOfferService } from '../../services/api';
import { useAuth } from '../../features/auth/AuthContext';
import useAlerts from '../../hooks/useAlert';
import logoImagen from '../../assets/images/logo.jpeg';

function CardOfertaTrabajo({ oferta, onOfferDeleted }) { 
  const { t } = useTranslation();
  const { showToast ,showConfirmAlert} = useAlerts();
  const { user, isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(oferta?.yaHaAplicado || false);

  if (!oferta) {
    return null; 
  }

  const handleApply = async () => {
    if (!user) {
      showToast('error', 'Acción requerida', 'Debes iniciar sesión para poder aplicar.');
      return;
    }

    setIsApplying(true);
    try {
      await applicationService.applyToJobOffer(user.id, oferta._id); 
      showToast('success', '¡Éxito!', 'Has aplicado correctamente a esta oferta.');
      setHasApplied(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showToast('info', 'Información', 'Ya habías aplicado a esta oferta.');
        setHasApplied(true);
      } else {
        showToast('error', 'Error', error.response?.data?.message || 'No se pudo completar la aplicación.');
      }
      console.error('Error al aplicar a la oferta:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDelete = async () => {
   const result = await showConfirmAlert(
      t('¿Estás seguro?'),
      t('La oferta de trabajo será eliminada permanentemente.'),
      { // Personalizamos los textos de los botones
        confirmButtonText: t('Sí, eliminar'),
        cancelButtonText: t('No, cancelar')
      }
    );

     if (!result) {
      return;
    }
    setIsDeleting(true);
    try {
      await applicationService.deleteApplication(oferta._id);
      showToast('success', t('¡Éxito!'), t('Oferta eliminada.'));
      if (onOfferDeleted) {
        onOfferDeleted(oferta._id);
      }
      setTimeout(() => {
         window.location.reload();
      },1000)
    } catch (error) {
      showToast('error', t('Error'), error.response?.data?.message || t('No se pudo eliminar la oferta.'));
    } finally {
      setIsDeleting(false);
    }
  };
  
  const isOwner = user && user._id === oferta.user_id;
  
  const companyName = oferta.id_empresa?.nombre || t('Indefinido');
  const tituloOferta = oferta.titulo || t('Título no disponible');
  const companyLogo =  logoImagen;
  const salaryText = oferta.salario ? `${oferta.salario.toLocaleString('es-ES')} €` : t('Indefinido');
  const modalityText = oferta.modalidad || t('Indefinido');
  const hoursText = oferta.horas_por_dia ? `${oferta.horas_por_dia}h / día` : t('Indefinido');
  const locationText = oferta.ubicacion || t('Indefinido');
  const descriptionText = oferta.descripcion || t('Sin descripción disponible.');
  
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
              <img src={companyLogo} alt={`${companyName} Logo`} className={styles.companyLogo} />
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
              <div className={styles.detailBox}><FontAwesomeIcon icon={faWifi} className={styles.icon} /> <span>{modalityText}</span></div>
              <div className={styles.detailBox}><FontAwesomeIcon icon={faClock} className={styles.icon} /> <span>{hoursText}</span></div>
              <div className={styles.detailBox}><FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} /> <span>{locationText}</span></div>
              <div className={styles.detailBox}><FontAwesomeIcon icon={faBuilding} className={styles.icon} /> <span>{salaryText}</span></div>
            </div>
            <Button 
              variant={hasApplied ? "danger" : "primary"} 
              className={`${styles.applyButton} ${hasApplied ? styles.appliedButton : ''}`} 
              onClick={handleApply}
              disabled={isApplying || hasApplied || isAdmin}
            >
              {isApplying ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : hasApplied ? (
                <><FontAwesomeIcon icon={faCheck} className="me-2" />{t('Aplicada')}</>
              ) : (
                t('Aplicar')
              )}
            </Button>
            {isOwner && (
              <Button
                variant="danger"
                className={`${styles.applyButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t('Eliminando...') : t('Eliminar candidatura')}
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CardOfertaTrabajo;
