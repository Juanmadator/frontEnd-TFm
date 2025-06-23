import { useState, useEffect, useCallback } from 'react';
import { jobOfferService, applicationService } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import OfertasTrabajo from './OfertaTrabajo';

function OfertasTrabajoPageProfile() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTodasLasOfertas = useCallback(async () => {
    try {
      setLoading(true);
      const [ofertasResponse, applicationsResponse] = await Promise.all([
        jobOfferService.getAllJobOffers(),
        user ? applicationService.getUserApplications(user.id) : Promise.resolve({ data: [] })
      ]);
      const todasLasOfertas = ofertasResponse.data;
      const misAplicaciones = applicationsResponse.data;
      const ofertasAplicadasIds = new Set(
        misAplicaciones.map(app => app.id_oferta._id)
      );
      const ofertasMejoradas = todasLasOfertas.map(oferta => ({
        ...oferta,
        yaHaAplicado: ofertasAplicadasIds.has(oferta._id)
      }));
      setOfertas(ofertasMejoradas);
    } catch (err) {
      console.error("Error al cargar datos de ofertas y aplicaciones:", err);
      setError("No se pudieron cargar las ofertas de trabajo.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodasLasOfertas();
  }, [fetchTodasLasOfertas]);

  return (
    <OfertasTrabajo 
      ofertas={ofertas}
      loading={loading}
      error={error}
      mostrarFormulario={false}
      onOfferCreated={fetchTodasLasOfertas} 
    />
  );
}

export default OfertasTrabajoPageProfile;
