// src/services/authService.js

const API_BASE_URL = 'http://localhost:3000/api';

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

export const registerUser = async (nombre,email,password,rol,username) => {
  const response = await fetch(`${API_BASE_URL}/usuarios/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({nombre,email,password,rol,username}),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al registrar usuario');
  }
  return data;
};