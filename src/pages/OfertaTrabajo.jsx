import { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Spinner } from 'react-bootstrap';
import CardOfertaTrabajo from '../components/CardOfertaTrabajo/CardOfertaTrabajo';
import { useTranslation } from 'react-i18next';
import styles from '../css/OfertaTrabajo.module.css';
import { CrearOferta } from '../components/CrearOferta/CrearOferta';

function OfertasTrabajo({ ofertas = [], loading, error, mostrarFormulario = true, onOfferCreated }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [ofertas]);

  const totalPages = Math.ceil(ofertas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ofertas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="light" />
          <h3 style={{ color: 'white', marginTop: '1rem' }}>{t('Cargando ofertas...')}</h3>
        </div>
      );
    }

    if (error) {
      return <h3 className="text-center" style={{ color: 'red' }}>{error}</h3>;
    }

    if (!ofertas || ofertas.length === 0) {
      return <p className="text-center" style={{color: 'white',marginBottom: '100px',color:'red'}}>{t('No se encontraron ofertas con esos criterios.')}</p>;
    }

    return currentItems.map((oferta) => (
      <Col key={oferta._id} xs={12}>
        <CardOfertaTrabajo oferta={oferta} />
      </Col>
    ));
  };

  return (
    <>
      {mostrarFormulario && (
        <Container className={styles.estilosEmpresa}>
          <CrearOferta onOfertaCreada={onOfferCreated} />
        </Container>
      )}
      
      <Container className={` ${styles.containerPrincipal}`}>
        <h2 className="mb-4" style={{ color: 'white' }}>{t('Ofertas de Trabajo')}</h2>
        <Row>
          {renderContent()}
        </Row>
        {totalPages > 1 && !loading && !error && (
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
    </>
  );
}

export default OfertasTrabajo;
