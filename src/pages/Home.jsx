// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import styles from "../css/Home.module.css";
import Busqueda from "../components/Busqueda/Busqueda";
import OfertasTrabajo from "./OfertaTrabajo";
import { jobOfferService } from '../services/api';

const Home = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filtros, setFiltros] = useState({
    titulo: '',
    ubicacion: ''
  });

  useEffect(() => {
    const temporizador = setTimeout(() => {
        const fetchOfertasFiltradas = async () => {
            try {
                setLoading(true);
              const response = await jobOfferService.getAllJobOffers(filtros);
              console.log("OFERTAS:",response)
                setOfertas(response.data);
            } catch (err) {
                setError("No se pudieron cargar las ofertas.");
            } finally {
                setLoading(false);
            }
        };
        fetchOfertasFiltradas();
    }, 500); 

    return () => clearTimeout(temporizador);
  }, [filtros]);

  const handleFiltroChange = (nuevosFiltros) => {
    setFiltros(prevFiltros => ({ ...prevFiltros, ...nuevosFiltros }));
  };
  
  return (
    <div className={styles.homeContainer}>
      <Busqueda 
        filtros={filtros} 
        onFiltroChange={handleFiltroChange} 
      />
      
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