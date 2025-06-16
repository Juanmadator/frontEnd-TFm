import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Login.module.css';
import { loginUser } from '../../services/authService';
import useAlerts from '../../hooks/useAlert'; // Asegúrate que el import apunte a useAlerts.js

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast, showLoadingAlert, closeAlert } = useAlerts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    showLoadingAlert('Iniciando sesión...', 'Por favor espera.');

    try {
      const data = await loginUser(email, password);
      console.log(data)
      closeAlert();
      showToast('success', 'BIENVENIDO', data.usuario.nombre || 'Has iniciado sesión con éxito.'); 

      setTimeout(() => {
        navigate('/'); 
      }, 1000); 

    } catch (error) {
      closeAlert();
      showToast('error', 'Error al iniciar sesión', error.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
      console.error('Error de login en el componente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Inicio de sesión</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar'}
          </button>
        </form>
        <div className={styles.signupPrompt}>
          Crea una cuenta <a href="/register" className={styles.signupLink}>Registro</a>
        </div>
      </div>
    </div>
  );
};