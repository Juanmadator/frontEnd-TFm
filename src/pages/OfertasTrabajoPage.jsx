// src/pages/OfertasTrabajoPage.jsx

import { useState, useEffect, useCallback } from 'react';
// Importamos los dos servicios que necesitamos y el hook de autenticación
import { jobOfferService, applicationService } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import OfertasTrabajo from './OfertaTrabajo';

function OfertasTrabajoPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Obtenemos el usuario para saber quién está logueado

  const fetchTodasLasOfertas = useCallback(async () => {
    try {
      setLoading(true);

      // Hacemos las dos llamadas a la API al mismo tiempo para más eficiencia
      const [ofertasResponse, applicationsResponse] = await Promise.all([
        jobOfferService.getAllJobOffers(),
        // Si hay un usuario, pedimos sus aplicaciones. Si no, devolvemos un array vacío.
        user ? applicationService.getUserApplications(user.id) : Promise.resolve({ data: [] })
      ]);

      const todasLasOfertas = ofertasResponse.data;
      const misAplicaciones = applicationsResponse.data;

      // Creamos un Set con los IDs de las ofertas a las que el usuario ya ha aplicado.
      // Un Set es mucho más rápido para hacer búsquedas que un array.
      const ofertasAplicadasIds = new Set(
        misAplicaciones.map(app => app.id_oferta._id)
      );

      // "Enriquecemos" cada oferta con un nuevo campo: 'yaHaAplicado'
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
  }, [user]); // El efecto ahora depende del 'user', si cambia, se vuelve a ejecutar

  useEffect(() => {
    fetchTodasLasOfertas();
  }, [fetchTodasLasOfertas]);

  return (
    <OfertasTrabajo 
      ofertas={ofertas}
      loading={loading}
      error={error}
      mostrarFormulario={true}
      // Pasamos la función para que el formulario de creación pueda refrescar la lista
      onOfferCreated={fetchTodasLasOfertas} 
    />
  );
}

export default OfertasTrabajoPage;