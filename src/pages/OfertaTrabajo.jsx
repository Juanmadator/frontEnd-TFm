// src/pages/OfertasTrabajoPage.jsx (ejemplo)
import { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import CardOfertaTrabajo from '../components/CardOfertaTrabajo/CardOfertaTrabajo'; // Ajusta la ruta
import { jobOfferService } from '../services/api'; // Ajusta la ruta a tu servicio de ofertas
import { useTranslation } from 'react-i18next';
import styles from '../css/OfertaTrabajo.module.css';
function OfertasTrabajo() {
  const { t } = useTranslation();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Por ejemplo, 5 ofertas por página
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        
        const response = await jobOfferService.getAllJobOffers(); 
        console.log(response)
        const allOfertas = response.data;
        setOfertas(allOfertas);
        setTotalPages(Math.ceil(allOfertas.length / itemsPerPage));

      } catch (err) {
        console.error("Error al cargar las ofertas:", err);
        setError(t('No se pudieron cargar las ofertas de trabajo.'));
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, [currentPage, itemsPerPage, t]); // Dependencias para re-cargar al cambiar de página

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ofertas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={`pagination-item-${number}`}
          active={number === currentPage}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }
    return items;
  };


  if (loading) {
    return (
      <Container className={`${styles.containerPrincipal} my-5 text-center`}>
        <h3>{t('Cargando ofertas de trabajo...')}</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={`${styles.containerPrincipal} my-5 text-center`}>
        <h3 style={{ color: 'red' }}>{error}</h3>
      </Container>
    );
  }

return (
    <Container className={` ${styles.containerPrincipal}`}>
        <h2 className="mb-4" style={{ color: 'white' }}>{t('Últimas Ofertas de Trabajo')}</h2>
        <Row>
            {currentItems.length > 0 ? (
                currentItems.map((oferta) => (
                    <Col key={oferta._id} xs={12}>
                        <CardOfertaTrabajo oferta={oferta} />
                    </Col>
                ))
            ) : (
                <Col xs={12} className="text-center">
                    <p>{t('No hay ofertas de trabajo disponibles en este momento.')}</p>
                </Col>
            )}
        </Row>

        {totalPages > 1 && (
            <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </Col>
            </Row>
        )}
    </Container>
);
}

export default OfertasTrabajo;