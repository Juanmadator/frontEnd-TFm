// src/pages/Home.jsx

import { useState, useEffect, useCallback } from 'react';
import styles from "../css/Home.module.css";
import Busqueda from "../components/Busqueda/Busqueda";
import OfertasTrabajo from "./OfertaTrabajo"; // El componente de presentación
// 1. Importamos todos los servicios y hooks necesarios
import { jobOfferService, applicationService } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';

const Home = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    titulo: '',
    ubicacion: ''
  });

  // Obtenemos el usuario del contexto para saber a qué ha aplicado
  const { user } = useAuth();

  // 2. Este useCallback ahora contiene TODA la lógica necesaria
  const fetchAndProcessOffers = useCallback(async () => {
    try {
      setLoading(true);

      // 3. Hacemos las dos llamadas a la API a la vez con Promise.all
      const [ofertasResponse, applicationsResponse] = await Promise.all([
        // Petición 1: Obtiene las ofertas YA FILTRADAS por el backend
        jobOfferService.getAllJobOffers(filtros),
        
        // Petición 2: Obtiene las aplicaciones del usuario logueado
        user ? applicationService.getUserApplications(user.id) : Promise.resolve({ data: [] })
      ]);

      const ofertasFiltradas = ofertasResponse.data;
      const misAplicaciones = applicationsResponse.data;

      // 4. Cruzamos los datos: creamos un Set para búsqueda rápida
      const ofertasAplicadasIds = new Set(
        misAplicaciones.map(app => app.id_oferta?._id).filter(Boolean)
      );

      // 5. "Enriquecemos" la lista (que ya viene filtrada) con el estado 'yaHaAplicado'
      const ofertasFinales = ofertasFiltradas.map(oferta => ({
        ...oferta,
        yaHaAplicado: ofertasAplicadasIds.has(oferta._id)
      }));

      setOfertas(ofertasFinales);
    } catch (err) {
      console.error("Error al cargar y procesar las ofertas:", err);
      setError("No se pudieron cargar las ofertas.");
    } finally {
      setLoading(false);
    }
  }, [filtros, user]); // El efecto depende de los filtros Y del usuario

  // Este useEffect no cambia, sigue llamando a la función principal
  useEffect(() => {
    // Usamos un debounce para no llamar a la API en cada tecla
    const timer = setTimeout(() => {
      fetchAndProcessOffers();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchAndProcessOffers]);

  const handleFiltroChange = (nuevosFiltros) => {
    setFiltros(prevFiltros => ({ ...prevFiltros, ...nuevosFiltros }));
  };
  
  return (
    <div className={styles.homeContainer}>
      <Busqueda 
        filtros={filtros} 
        onFiltroChange={handleFiltroChange} 
      />
      
      {/* 6. Le pasamos al componente de presentación la lista final, que ya está filtrada y enriquecida */}
      <OfertasTrabajo 
        ofertas={ofertas}
        loading={loading}
        error={error}
        mostrarFormulario={false}
      />
    </div>
  );
};

export default Home;