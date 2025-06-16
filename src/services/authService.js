const API_BASE_URL = 'http://localhost:3000/api';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json(); // Parsea la respuesta JSON

    if (!response.ok) {
      // Si la respuesta no es 2xx (ej. 400, 401, 500), lanza un error
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    // --- Lógica de guardado en localStorage ---

    // 1. Guardar la información del usuario siempre, sea admin o no.
    // La API devuelve el objeto 'usuario' dentro de 'data'.
    if (data.usuario) {
      console.log(data)
      localStorage.setItem('user', JSON.stringify(data.usuario));
      console.log('Información del usuario guardada:', data.usuario);
    } else {
      console.warn('La respuesta del login no contiene información de usuario.');
    }

    // 2. Guardar el token SOLO si data.usuario.rol es 'admin' Y data.token existe.
    if (data.usuario && data.usuario.rol === 'admin' && data.token) {
      localStorage.setItem('userToken', data.token);
      console.log('Token de administrador guardado.');
    } else if (data.usuario && data.usuario.rol === 'admin' && !data.token) {
        console.warn('Usuario es admin pero no se proporcionó un token.');
    } else {
        console.log('Usuario no es admin, no se guarda token.');
    }

    return data; // Retorna los datos de éxito (ej. { message: "Login exitoso", usuario: {...}, token: "..." })

  } catch (error) {
    console.error('Error en la llamada al API de login:', error);
    throw error; // Propaga el error para que el componente lo maneje
  }
};


export const registerUser = async (nombre, email, password, rol, username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/register`, { // Asegúrate de que esta sea la ruta correcta de tu API de registro
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, email, password, rol, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la API devuelve un mensaje de error, úsalo; de lo contrario, un mensaje genérico.
      throw new Error(data.message || 'Error al registrar usuario');
    }

    if (data.token) { // Esto es opcional, depende de si tu backend loguea al registrar
      localStorage.setItem('userToken', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data; // Retorna los datos de éxito
  } catch (error) {
    console.error('Error en la llamada al API de registro:', error);
    throw error; // Propaga el error
  }
};