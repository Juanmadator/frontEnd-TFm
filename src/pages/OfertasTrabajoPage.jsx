// src/pages/OfertasTrabajoPage.jsx (Nuevo Componente Contenedor)

import { useState, useEffect, useCallback } from 'react';
import { jobOfferService } from '../services/api';
import OfertasTrabajo from './OfertaTrabajo'; // Importamos el componente de presentación

function OfertasTrabajoPage() {
  // 1. ESTE COMPONENTE SÍ TIENE ESTADO Y LÓGICA PARA CARGAR DATOS
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. CREAMOS LA FUNCIÓN PARA OBTENER LOS DATOS
  const fetchTodasLasOfertas = useCallback(async () => {
    try {
      setLoading(true);
      // Llamamos a la API sin filtros para obtener todo
      const response = await jobOfferService.getAllJobOffers();
      setOfertas(response.data);
    } catch (err) {
      setError("No se pudieron cargar las ofertas de trabajo.");
    } finally {
      setLoading(false);
    }
  }, []); // useCallback para que la función no se recree innecesariamente

  // 3. USAMOS useEffect PARA LLAMAR A LA FUNCIÓN AL MONTAR EL COMPONENTE
  useEffect(() => {
    fetchTodasLasOfertas();
  }, [fetchTodasLasOfertas]);

  // 4. RENDERIZAMOS EL COMPONENTE DE PRESENTACIÓN y le pasamos los datos
  return (
    <OfertasTrabajo 
      ofertas={ofertas}
      loading={loading}
      error={error}
      mostrarFormulario={true} // En esta página sí queremos el formulario para crear
      onOfferCreated={fetchTodasLasOfertas} // Le pasamos la función para que pueda refrescar la lista al crear una nueva oferta
    />
  );
}

export default OfertasTrabajoPage;