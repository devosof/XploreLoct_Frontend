import api from './api';

export const eventService = {
    
  // get event speakers
  getSpeakers: () => {
    const token = localStorage.getItem('accessToken');
    return api.get('/api/organizers/speakers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  // Get event details
  getEventById: (eventId) => {
    const token = localStorage.getItem('accessToken');
    return api.get(`/api/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  // Update basic event information
  updateEvent: (eventId, eventData) => {
    const token = localStorage.getItem('accessToken');
    return api.put(`/api/events/${eventId}`, eventData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  // Update event details separately
  updateEventDetails: async (eventId, detailsData) => {
    const token = localStorage.getItem('accessToken');
    console.log('Sending to backend:', detailsData); // Debug log
    
    return api.put(`/api/events/${eventId}/details`, detailsData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Location services
  getCountries: async () => {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/codes');
    const data = await response.json();
    return data.data;
  },
  
  getCities: async (country) => {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    });
    const data = await response.json();
    return data.data;
  }
};