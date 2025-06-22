import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Register.module.css';
import { companyService } from '../../services/api';
import useAlerts from '../../hooks/useAlert';

export const CreateCompany = () => {
  // 1. Estados simplificados (sin selectedLogoFile ni imageUploading)
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [email_contacto, setEmailContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setUserId(user.id);
    } else {
      showToast('error', 'Error', 'No se pudo obtener el ID de usuario. Inicia sesión.');
    }
  }, [showToast]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      showToast('error', 'Error', 'ID de usuario no disponible.');
      return;
    }

    setLoading(true);
    showLoadingAlert('Creando empresa...', 'Por favor espera.');

    try {
      const companyData = {
        nombre,
        descripcion,
        email_contacto,
        direccion,
        user_id: userId,
      };

      const response = await companyService.createCompany(companyData);

      closeAlert();
      showToast('success', '¡Empresa Creada!', response.data.message || 'La empresa ha sido registrada con éxito.');

      setTimeout(() => {
        navigate('/empresas');
      }, 1500);

    } catch (error) {
      closeAlert();
      const errorMessage = error.response?.data?.message || 'Hubo un problema al registrar la empresa.';
      showToast('error', 'Error', errorMessage);
      console.error('Error al crear empresa:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Registrar Empresa</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          
          <div className={styles.formColumns}>
            
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <input
                  id="company-nombre"
                  type="text"
                  className={styles.inputField}
                  placeholder='Ej: Innovatech Solutions'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="company-email"
                  type="email"
                  className={styles.inputField}
                  placeholder='contacto@innovatech.com'
                  value={email_contacto}
                  onChange={(e) => setEmailContacto(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <textarea
                  id="company-descripcion"
                  className={styles.inputField}
                  placeholder='Describe la misión y visión de tu empresa...'
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  disabled={loading}
                  rows="5"
                ></textarea>
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="company-direccion"
                  type="text"
                  className={styles.inputField}
                  placeholder='Ej: Calle Falsa 123, Springfield'
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Empresa'}
          </button>
        </form>
        
        <div className={styles.loginPrompt}>
          <a href="/empresas" className={styles.loginLink}>
            Volver a la lista de empresas
          </a>
        </div>
      </div>
    </div>
  );
};