import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { eventService } from '../services/eventService';
import { Upload, Calendar, MapPin } from 'lucide-react';

export default function UpdateEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    country: '',
    city: '',
    district: '',
    town: '',
    place: '',
    latitude: '',
    longitude: '',
    google_maps_link: '',
    frequency: '',
    capacity: '',
    gender_allowance: '',
    time: '',
    duration: '',
    event_date: '',
    attendee_count: '',
    speakers: [],
    image: null
  });
  const [availableSpeakers, setAvailableSpeakers] = useState([]);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventResponse, speakersResponse] = await Promise.all([
          eventService.getEventById(eventId),
          eventService.getSpeakers()
        ]);

        const event = eventResponse.data.data;
        const speakers = speakersResponse.data.data || [];
        
        setAvailableSpeakers(speakers);
        
        // Set event data including details if available
        setEventData({
          name: event.name,
          description: event.description,
          country: event.country,
          city: event.city,
          district: event.district,
          town: event.town,
          place: event.place,
          latitude: event.latitude,
          longitude: event.longitude,
          google_maps_link: event.google_maps_link,
          frequency: event.frequency,
          capacity: event.capacity,
          gender_allowance: event.gender_allowance,
          time: event.time,
          duration: event.duration,
          // Handle event details if they exist
          event_date: event.details && event.details !== "Event Details have not been updated yet" 
            ? new Date(event.details.event_date).toISOString().split('T')[0]
            : '',
          attendee_count: event.details && event.details !== "Event Details have not been updated yet"
            ? event.details.attendee_count || ''
            : '',
          speakers: event.details && event.details !== "Event Details have not been updated yet" 
            ? (Array.isArray(event.details.eventspeakers) 
                ? event.details.eventspeakers 
                : [])
            : []
        });

        setImagePreview(event.image_url);
        
        // Fetch cities for the current country
        if (event.country) {
          const citiesData = await eventService.getCities(event.country);
          setCities(citiesData);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch countries
    const fetchCountries = async () => {
      try {
        const countriesData = await eventService.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load countries');
      }
    };

    fetchEventData();
    fetchCountries();
  }, [eventId, navigate]);

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setEventData(prev => ({ ...prev, country, city: '' }));
    
    try {
      const citiesData = await eventService.getCities(country);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to load cities');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setEventData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData for basic event information
      const eventFormData = new FormData();
      
      // Fields for events table
      const eventFields = [
        'name', 'description', 'country', 'city', 'district', 
        'town', 'place', 'latitude', 'longitude', 'google_maps_link',
        'frequency', 'capacity', 'gender_allowance', 'time', 'duration'
      ];

      // Only append fields that have been modified
      eventFields.forEach(field => {
        if (eventData[field] !== '' && eventData[field] !== null) {
          eventFormData.append(field, eventData[field]);
        }
      });

      // Add image if it exists
      if (eventData.image instanceof File) {
        eventFormData.append('image', eventData.image);
      }

      // Create separate object for event details
      const detailsData = {
        event_date: eventData.event_date || null,
        attendee_count: eventData.attendee_count || null,
        eventspeakers: Array.isArray(eventData.speakers) ? eventData.speakers : []
      };

      // Log the data being sent
      console.log('Event Details Data:', {
        ...detailsData,
        eventspeakers: JSON.stringify(detailsData.eventspeakers)
      });

      // Only make the requests if there's data to update
      if (Array.from(eventFormData.entries()).length > 0) {
        await eventService.updateEvent(eventId, eventFormData);
      }

      // Always update event details
      await eventService.updateEventDetails(eventId, {
        event_date: detailsData.event_date,
        attendee_count: detailsData.attendee_count,
        eventspeakers: JSON.stringify(detailsData.eventspeakers)
      });

      toast.success('Event updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Update Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Image
          </label>
          <div className="flex items-center space-x-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
            )}
            <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Upload className="h-5 w-5 inline-block mr-2" />
              Change Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            value={eventData.name}
            onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              value={eventData.country}
              onChange={handleCountryChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <select
              value={eventData.city}
              onChange={(e) => setEventData(prev => ({ ...prev, city: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Time and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Time
            </label>
            <input
              type="time"
              value={eventData.time}
              onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (in hours)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={eventData.duration}
              onChange={(e) => setEventData(prev => ({ ...prev, duration: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>

        {/* Event Date and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              value={eventData.event_date}
              onChange={(e) => setEventData(prev => ({ ...prev, event_date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={eventData.capacity}
              onChange={(e) => setEventData(prev => ({ ...prev, capacity: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>

        {/* Frequency and Gender Allowance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              value={eventData.frequency}
              onChange={(e) => setEventData(prev => ({ ...prev, frequency: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select Frequency</option>
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender Allowance
            </label>
            <select
              value={eventData.gender_allowance}
              onChange={(e) => setEventData(prev => ({ ...prev, gender_allowance: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select Gender Allowance</option>
              <option value="FAMILY">All</option>
              <option value="MALE">Male Only</option>
              <option value="FEMALE">Female Only</option>
            </select>
          </div>
        </div>

        {/* Attendee Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Actual Attendee Count
          </label>
          <input
            type="number"
            min="0"
            value={eventData.attendee_count}
            onChange={(e) => setEventData(prev => ({ ...prev, attendee_count: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Speakers Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Speakers (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableSpeakers.length > 0 ? (
              availableSpeakers.map(speaker => (
                <label 
                  key={speaker.speaker_id}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={eventData.speakers.includes(speaker.speaker_id)}
                    onChange={(e) => {
                      setEventData(prev => ({
                        ...prev,
                        speakers: e.target.checked
                          ? [...prev.speakers, speaker.speaker_id]
                          : prev.speakers.filter(id => id !== speaker.speaker_id)
                      }));
                    }}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    {speaker.avatar && (
                      <img
                        src={speaker.avatar}
                        alt={speaker.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {speaker.name}
                    </span>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No speakers available</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
}