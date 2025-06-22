// src/services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'tfm-back-fz5sr5ojo-juanmadators-projects.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      console.error('Error de autenticación: Token expirado o inválido.');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userService = {
  login: async (credentials) => API.post('/usuarios/login', credentials),
  register: async (userData) => API.post('/usuarios/register', userData),
  getAllUsers: async () => API.get('/usuarios'),
  getUserById: async (id) => API.get(`/usuarios/${id}`),
  createUser: async (userData) => API.post('/usuarios', userData),
  updateUser: async (id, userData) => API.put(`/usuarios/${id}`, userData),
  deleteUser: async (id) => API.delete(`/usuarios/${id}`),
};

export const companyService = {
  getAllCompanies: async () => API.get('/empresas'),
  getCompanyById: async (id) => API.get(`/empresas/${id}`),
  createCompany: async (companyData) => API.post('/empresas', companyData),
  updateCompany: async (id, companyData) => API.put(`/empresas/${id}`, companyData),
  deleteCompany: async (id) => API.delete(`/empresas/${id}`),
};

export const jobOfferService = {
  getAllJobOffers: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.titulo) {
      params.append('titulo', filtros.titulo);
    }
    if (filtros.ubicacion) {
      params.append('ubicacion', filtros.ubicacion);
    }

    const queryString = params.toString();
    
    // La llamada ahora es dinámica.
    return API.get(`/ofertas?${queryString}`);
  },
  getJobOfferById: async (id) => API.get(`/ofertas/${id}`),
  createJobOffer: async (jobOfferData) => API.post('/ofertas', jobOfferData),
  updateJobOffer: async (id, jobOfferData) => API.put(`/ofertas/${id}`, jobOfferData),
  deleteJobOffer: async (id) => API.delete(`/ofertas/${id}`),
};

export const uploadsService = {
  uploadResume: async (pdfFile, userId) => {
    if (!pdfFile) {
      throw new Error('No se ha proporcionado ningún archivo PDF para subir.');
    }
    if (!userId) {
      throw new Error('El ID de usuario es necesario para subir el currículum.');
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await API.post(`/uploads/resume/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error('La subida fue exitosa, pero no se recibió la URL del currículum.');
      }
    } catch (error) {
      console.error('Error en uploadsService.uploadResume:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al subir el currículum. Inténtalo de nuevo.');
    }
  },

  uploadProfileImage: async (imageFile, userId) => {
    if (!imageFile) {
      throw new Error('No se ha proporcionado ningún archivo de imagen para subir.');
    }
    if (!userId) {
      throw new Error('El ID de usuario es necesario para subir la imagen de perfil.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await API.post(`/uploads/profile-image/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error('La subida fue exitosa, pero no se recibió la URL de la imagen de perfil.');
      }
    } catch (error) {
      console.error('Error en uploadsService.uploadProfileImage:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al subir la imagen de perfil. Inténtalo de nuevo.');
    }
  },
};
