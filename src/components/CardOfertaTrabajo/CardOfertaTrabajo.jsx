// src/components/CardOfertaTrabajo/CardOfertaTrabajo.jsx
import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faClock, faMapMarkerAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'; // faMoneyBillWave si lo vas a usar
import { useTranslation } from 'react-i18next';
import styles from './CardOfertaTrabajo.module.css'; // Importa el CSS Module
import { jobOfferService } from '../../services/api'; // Importar el servicio de ofertas
import useAlerts from '../../hooks/useAlert'; // Asumiendo que tienes este hook de alertas

// Recibe 'onOfferDeleted' como prop para notificar al padre cuando una oferta se elimina
function CardOfertaTrabajo({ oferta, onOfferDeleted }) {
  const { t } = useTranslation();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [isCreador, setIsCreador] = useState(false); 

  // Obtener el ID del usuario loggeado de localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Asumiendo que guardas el objeto de usuario aquí
    if (user && user.id) { // Asumiendo que el ID del usuario está en user._id (común en MongoDB)
      setLoggedInUserId(user.id);
    }

   
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar

  // Datos de ejemplo para la oferta si no se pasan por props o para desarrollo
  // He añadido user_id en defaultOferta para que puedas probar la visibilidad del botón
  const defaultOferta = {
    id: 'default-1', // Usar _id para que coincida con MongoDB
    nombreEmpresa: 'Nombre de la empresa',
    descripcion: 'Lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum lorem ipsum',
    urlLogoEmpresa: 'https://via.placeholder.com/60',
    remoto: true,
    ubicacion: 'Córdoba',
    horas_por_dia: '8 horas / día', // Como está en tu código
    salario: {
        minimo: 18000,
        moneda: '€',
        tipo: 'anual'
    },
    fechaPublicacion: 'Hace 24 horas',
    user_id: 'ID_DE_USUARIO_PARA_PROBAR_VISIBILIDAD', // Cambia esto para probar: hazlo igual que el user._id de tu localStorage para ver el botón
  };

  const currentOferta = oferta || defaultOferta;

  const handleApply = () => {
    console.log(`Aplicar a oferta ${currentOferta.id} de ${currentOferta.nombreEmpresa}`);
    // Lógica para aplicar
  };

  const handleDelete = async () => {
    if (!window.confirm(t('¿Estás seguro de que quieres eliminar esta oferta?'))) {
      return;
    }

    setIsDeleting(true);
    showLoadingAlert(t('Eliminando oferta...'), t('Por favor, espera.'));

    try {
      await jobOfferService.deleteJobOffer(currentOferta.id); // Llama al servicio de eliminación
      closeAlert();
      showToast('success', t('¡Éxito!'), t('Oferta eliminada correctamente.'));
      // Notificar al componente padre para que actualice la lista de ofertas
      if (onOfferDeleted) {
        onOfferDeleted(currentOferta.id);
      }
    } catch (error) {
      closeAlert();
      showToast('error', t('Error'), error.response?.data?.message || t('Hubo un problema al eliminar la oferta.'));
      console.error('Error al eliminar oferta:', error.response?.data || error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const showDeleteButton = loggedInUserId && loggedInUserId === currentOferta.user_id;

  return (
    <Card className={styles.cardContainer}>
      <Card.Body className={styles.cardBody}>
        <Row className="align-items-start">
          {/* Columna Izquierda: Logo y Descripción */}
          <Col xs={12} md={8} className={styles.leftColumn}>
            <div className={styles.companyHeader}>
              <img src={currentOferta.urlLogoEmpresa} alt="Company Logo" className={styles.companyLogo} />
              <Card.Title className={styles.companyName}>{currentOferta.nombreEmpresa}</Card.Title>
            </div>
            <Card.Text className={styles.description}>
              {currentOferta.descripcion}
            </Card.Text>
            <div className={styles.footerInfo}>
              <span className={styles.viewMoreLink}>{t('Ver más')}</span>
              <span className={styles.timeAgo}>{currentOferta.fechaPublicacion}</span>
            </div>
          </Col>

          {/* Columna Derecha: Detalles y Botón Aplicar */}
          <Col xs={12} md={4} className={styles.rightColumn}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailBox}>
                {oferta.tipo_empleo && (
                  <>
                    <span>{t('Remoto')}</span> <FontAwesomeIcon icon={faWifi} />
                  </>
                )}
                {!oferta.tipo_empleo && <span>{t('Presencial')}</span>} {/* Mostrar Presencial si no es remoto */}
              </div>
              <div className={styles.detailBox}>
                <span>{currentOferta.horas_por_dia}</span> <FontAwesomeIcon icon={faClock} />
              </div>
              <div className={styles.detailBox}>
                <span>{currentOferta.ubicacion}</span> <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className={styles.detailBox}>
                <span>
                  {currentOferta.salario?.minimo && // Acceso seguro a salario.minimo
                   `${currentOferta.salario.minimo} ${currentOferta.salario.moneda || '€'} ${currentOferta.salario.tipo || ''}` // Muestra min, moneda, tipo
                  }
                  {!currentOferta.salario?.minimo && t('Salario no especificado')}
                </span>
                
              </div>
            </div>
            <Button variant="primary" className={styles.applyButton} onClick={handleApply}>
              {t('Aplicar')}
            </Button>

            {/* Botón Eliminar (Condicional) */}
            {showDeleteButton && (
              <Button
                variant="danger" // Bootstrap variant for red
                className={`${styles.applyButton} ${styles.deleteButton}`} // Reutiliza estilos de tamaño, añade estilo rojo
                onClick={handleDelete}
                disabled={isDeleting} // Deshabilita durante la eliminación
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