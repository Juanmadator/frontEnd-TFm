import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Register.module.css'; 
import { registerUser } from '../../services/authService';
import useAlerts from '../../hooks/useAlert';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    showLoadingAlert('Registrando usuario...', 'Por favor espera.');

    const rol = isAdmin ? 'admin' : 'usuario';

    try {
      const data = await registerUser(nombre, email, password, rol, username);
      closeAlert();
      showToast('success', '¡Registro Exitoso!', data.message || 'Tu cuenta ha sido creada.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      closeAlert();
      showToast('error', 'Error en el Registro', error.message || 'Hubo un problema al crear tu cuenta. Inténtalo de nuevo.');
      console.error('Error de registro en el componente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Registro</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {/* Contenedor para las dos columnas */}
          <div className={styles.formColumns}>
            {/* Columna Izquierda: Nombre y Username */}
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                <input
                  id="nombre"
                  type="text"
                  className={styles.inputField}
                  placeholder='Nombre'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="username"
                  type="text"
                  className={styles.inputField}
                  placeholder='Username'
                  
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Columna Derecha: Email y Contraseña */}
            <div className={styles.column}>
              <div className={styles.inputGroup}>
                
                <input
                  id="email"
                  type="email"
                  className={styles.inputField}
                  value={email}
                   placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  id="password"
                  type="password"
                  className={styles.inputField}
                  value={password}
                   placeholder='Contraseña'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div> {/* Fin de formColumns */}

          {/* Checkbox de Rol Admin (fuera de las columnas para que ocupe todo el ancho) */}
          <div className={styles.checkboxGroup}>
            <input
              id="isAdmin"
              type="checkbox"
              className={styles.checkboxField}
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="isAdmin" className={styles.checkboxLabel}>Administrador</label>
          </div>

          <button type="submit" className={styles.registerButton} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div className={styles.loginPrompt}>
          ¿Ya tienes una cuenta? <a href="/login" className={styles.loginLink}>Iniciar Sesión</a>
        </div>
      </div>
    </div>
  );
};