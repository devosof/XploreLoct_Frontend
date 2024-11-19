import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Info, Image } from 'lucide-react';
import useEvents from '../hooks/useEvents';
import useSpeakers from '../hooks/useSpeakers';
import { toast } from 'react-toastify';

export default function EventCreate() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { availableSpeakers, loading } = useSpeakers();
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender_allowance: 'ALL',
      frequency: 'once',
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log('Form data:', data);

      const formData = new FormData();

      formData.append('name', data.title);
      formData.append('description', data.description);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('town', data.town || '');
      formData.append('district', data.district || '');
      formData.append('place', data.place || '');
      formData.append('latitude', data.latitude || '');
      formData.append('longitude', data.longitude || '');
      formData.append('google_maps_link', data.google_maps_link || '');
      formData.append('frequency', data.frequency);
      formData.append('capacity', data.capacity);
      formData.append('gender_allowance', data.gender_allowance);
      formData.append('time', data.time);
      formData.append('duration', data.duration);
      formData.append('event_date', data.event_date);
      formData.append('attendee_count', data.attendee_count);

      if (Array.isArray(data.speakers)) {
        formData.append('eventspeakers', JSON.stringify(data.speakers));
      }

      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await createEvent(formData);
      
      if (response && response.event_id) {
        toast.success('Event created successfully!');
        navigate(`/events/${response.event_id}`);
      } else {
        console.error('No event ID received:', response);
        toast.error('Event created but ID not received');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error(error.message || 'Failed to create event. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Event Image (Optional)</label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    {...register('image')}
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
                  />
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a high-quality image for your event. Max file size 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Date (YYYY-MM-DD)</label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    {...register('event_date', { required: 'Event date is required' })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                {errors.event_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.event_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <div className="mt-1 relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    {...register('time', { required: 'Time is required' })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  {...register('duration', { required: 'Duration is required' })}
                  placeholder="e.g., 2 hours, 3 days"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  {...register('frequency', { required: 'Frequency is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select frequency</option>
                  <option value="once">One-time event</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {errors.frequency && (
                  <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <div className="mt-1 relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('capacity', {
                      required: 'Capacity is required',
                      min: { value: 1, message: 'Capacity must be at least 1' },
                    })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Actual Attendees (Optional)</label>
                <input
                  type="number"
                  {...register('attendee_count')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.attendee_count && (
                  <p className="mt-1 text-sm text-red-600">{errors.attendee_count.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender Allowance</label>
              <select
                {...register('gender_allowance', { required: 'Gender allowance is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select gender allowance</option>
                <option value="FAMILY">Family</option>
                <option value="MALE">Male only</option>
                <option value="FEMALE">Female only</option>
              </select>
              {errors.gender_allowance && (
                <p className="mt-1 text-sm text-red-600">{errors.gender_allowance.message}</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowSpeakers(!showSpeakers)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700"
              >
                <span>Select Speakers</span>
                <span className="text-xs">({showSpeakers ? 'Hide' : 'Show'})</span>
              </button>
              
              {showSpeakers && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speakers</label>
                  {loading ? (
                    <p>Loading speakers...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {availableSpeakers.map((speaker) => (
                        <label key={speaker.speaker_id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            value={speaker.speaker_id}
                            {...register('speakers')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-700">{speaker.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.speakers && (
                    <p className="mt-1 text-sm text-red-600">{errors.speakers.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location Details</h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <input
                    type="text"
                    {...register('district', { required: 'District is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Town</label>
                  <input
                    type="text"
                    {...register('town', { required: 'Town is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.town && (
                    <p className="mt-1 text-sm text-red-600">{errors.town.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Place</label>
                <input
                  type="text"
                  {...register('place', { required: 'Place is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.place && (
                  <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Google Maps Link</label>
                <input
                  type="url"
                  {...register('google_maps_link')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register('latitude')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register('longitude')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Create Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
