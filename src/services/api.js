import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post('/api/users/refresh-token');
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = error.response?.data?.message || 'An error occurred';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (credentials) =>
    api.post('/api/users/login', credentials),
  register: (userData) => api.post('/api/users/register', userData),
  logout: () => api.post('/api/users/logout'),
  refreshToken: () => api.post('/api/users/refresh-token'),
};

// Events endpoints
export const events = {
  getTrending: () => api.get('/api/events/trending'),
  getRandom: () => api.get('/api/events/random'),
  searchByQuery: (params) => api.get('/api/events/search', { params }),
  searchByLocation: (params) => api.get('/api/events', { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (formData) => api.post('/api/events/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  addDetails: (eventId, details) =>
    api.post(`/api/events/${eventId}/details`, details),
  addReview: (eventId, review) =>
    api.post(`/api/events/${eventId}/review`, review),
  getReviews: (eventId) => api.get(`/api/events/${eventId}/reviews`),
  toggleInterested: (eventId) => api.post(`/api/users/interested/${eventId}`),
};

// Location endpoints
export const locations = {
  getCountries: () => api.get('/api/events/countries'),
  getCities: (country) => api.get(`/api/events/cities/${country}`),
  getPlaces: (city) => api.get(`/api/events/locations/${city}`),
};

// User endpoints
export const users = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (profileData) => api.patch('/api/users/profile/update', profileData),
  getInterestedEvents: () => api.get('/api/users/interested-events'),
};

// Organizer endpoints
export const organizers = {
  register: (organizerData) => api.post('/api/organizers/register', organizerData),
  getProfile: () => api.get('/api/organizers/profile'),
  getSpeakers: () => api.get('/api/organizers/speakers'),
  getEvents: () => api.get('/api/organizers/events'),
};

// Speaker endpoints
export const speakers = {
  register: (speakerData) => api.post('/api/speakers/register', speakerData),
};

// Admin endpoints
export const admin = {
  login: (credentials) =>
    api.post('/api/admin/login', credentials),
  getOrganizations: () => api.get('/api/admin/organizations'),
  createOrganization: (orgData) => api.post('/api/admin/create-organization', orgData),
  updateOrganization: (orgId, orgData) =>
    api.put(`/api/admin/organizations/${orgId}`, orgData),
  deleteOrganization: (orgId) => api.delete(`/api/admin/organizations/${orgId}`),
};

export default api;