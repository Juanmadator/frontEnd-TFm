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
   const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setUserId(user.id);
       if (user.rol === 'admin') {
        setIsAdmin(true);
      }
    } else {
      showToast('error', 'Autenticacion fallida', 'Debes ser administrador.');
    }
  }, [showToast]);


  const limpiarFormulario = () => {
  setNombre('');
  setDescripcion('');
  setEmailContacto('');
  setDireccion('');
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      showToast('error', 'Error', 'Inicia sesion');
      limpiarFormulario();
      return;
    }

    if (!isAdmin) {
      showToast('error', 'Acceso denegado', 'Debes ser administrador');
      limpiarFormulario();

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


       limpiarFormulario();


    } catch (error) {
      closeAlert();
      const errorMessage = error.response?.data?.message || 'Hubo un problema al registrar la empresa.';
      showToast('error', 'Error', errorMessage);
      console.error('Error al crear empresa:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

    if (!isAdmin) {
      return (
          <div className={styles.registerContainer} style={{ marginTop: "40px" }}>
              <div className={styles.registerCard}>
                  <h2 className={styles.registerTitle}>Crear Nueva Oferta</h2>
                  <p className="text-center" style={{color: '#ffc107'}}>
                      No tienes permisos de administrador para acceder a esta sección.
                  </p>
              </div>
          </div>
      );
    }

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
          <a href="/" className={styles.loginLink}>
            Volver a la lista de ofertas
          </a>
        </div>
      </div>
    </div>
  );
};