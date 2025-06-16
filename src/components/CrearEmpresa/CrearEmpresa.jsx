import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Register.module.css';
import { companyService } from '../../services/api';
import useAlerts from '../../hooks/useAlert';

export const CreateCompany = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [email_contacto, setEmailContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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

  const handleFileChange = (e) => {
    setSelectedLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      showToast('error', 'Error', 'ID de usuario no disponible. Asegúrate de estar loggeado.');
      return;
    }

    setLoading(true);
    showLoadingAlert('Creando empresa...', 'Por favor espera.');

    let logoUrl = '';

    try {
      if (selectedLogoFile) {
        setImageUploading(true);
        showLoadingAlert('Subiendo logo...', 'Esto puede tardar un momento.');
        logoUrl = await imageUploadService.uploadImage(selectedLogoFile);
        setImageUploading(false);
        closeAlert();
        showLoadingAlert('Creando empresa...', 'Casi terminamos.');
      }

      const companyData = {
        nombre,
        descripcion,
        url_logo: logoUrl,
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
      let errorMessage = 'Hubo un problema al registrar la empresa. Inténtalo de nuevo.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('Error al subir la imagen')) {
        errorMessage = error.message;
      }
      showToast('error', 'Error', errorMessage);
      console.error('Error al crear empresa en el componente:', error.response?.data || error.message || error);
    } finally {
      setLoading(false);
      setImageUploading(false);
    }
  };

  return (
    <div className={styles.registerContainer} style={{ color: 'white' }}>
      <div className={styles.registerCard} style={{ color: 'white' }}>
        <h2 className={styles.registerTitle} style={{ color: 'white' }}>Registrar Empresa</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm} style={{ color: 'white' }}>
          <div className={styles.formColumns}>
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <input
                  id="company-nombre"
                  type="text"
                  className={styles.inputField}
                  placeholder='Nombre de la Empresa'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={loading || imageUploading}
                  style={{ color: 'white' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="company-email"
                  type="email"
                  className={styles.inputField}
                  placeholder='Email de Contacto'
                  value={email_contacto}
                  onChange={(e) => setEmailContacto(e.target.value)}
                  required
                  disabled={loading || imageUploading}
                  style={{ color: 'white' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label 
                  htmlFor="company-logo-upload" 
                  className={`${styles.fileInputLabel} ${selectedLogoFile ? styles.hasFile : ''}`}
                  style={{ color: 'white' }}
                >
                  {selectedLogoFile ? selectedLogoFile.name : 'Subir Logo (PNG, JPG)'}
                </label>
                <input
                  id="company-logo-upload"
                  type="file"
                  className={styles.hiddenFileInput}
                  onChange={handleFileChange}
                  disabled={loading || imageUploading}
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ color: 'white' }}
                />
              </div>
            </div>

            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <textarea
                  id="company-descripcion"
                  className={styles.inputField}
                  placeholder='Descripción de la Empresa'
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  disabled={loading || imageUploading}
                  rows="4"
                  style={{ color: 'white' }}
                ></textarea>
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="company-direccion"
                  type="text"
                  className={styles.inputField}
                  placeholder='Dirección'
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  disabled={loading || imageUploading}
                  style={{ color: 'white' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading || imageUploading}
            style={{ color: 'white' }}
          >
            {loading ? 'Registrando Empresa...' : (imageUploading ? 'Subiendo logo...' : 'Registrar Empresa')}
          </button>
        </form>
        <div className={styles.loginPrompt} style={{ color: 'white' }}>
          <a href="/empresas" className={styles.loginLink} style={{ color: 'white' }}>Volver a la lista de empresas</a>
        </div>
      </div>
    </div>
  );
};
