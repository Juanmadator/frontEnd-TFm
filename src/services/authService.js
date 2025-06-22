// src/services/authService.js

const API_BASE_URL = 'https://tfm-back.vercel.app/api';

// La función ahora es mucho más simple. Solo hace la petición y devuelve los datos.
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();


  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }
  return data;
};

// Hacemos lo mismo para el registro
export const registerUser = async (nombre,email,password,rol,username) => {
  const response = await fetch(`${API_BASE_URL}/usuarios/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({nombre,email,password,rol,username}),
  });
  console.log(response)
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al registrar usuario');
  }
  return data;
};