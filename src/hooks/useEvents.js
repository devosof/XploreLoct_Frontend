import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { events } from '../services/api';
import useStore from '../store/useStore';

export default function useEvents() {
  const [loading, setLoading] = useState(false);
  const { trendingEvents, setTrendingEvents, interestedEvents, setInterestedEvents } = useStore();

  const fetchTrendingEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await events.getTrending();
      setTrendingEvents(data);
    } catch (error) {
      const { data } = await events.getRandom();
      setTrendingEvents(data);
    } finally {
      setLoading(false);
    }
  }, [setTrendingEvents]);

  const searchEvents = useCallback(async (query) => {
    try {
      setLoading(true);
      const { data } = await events.search(query);
      return data;
    } catch (error) {
      toast.error('Failed to search events.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventById = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await events.getById(id);
      return data;
    } catch (error) {
      toast.error('Failed to fetch event details.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (formData) => {
    try {
      setLoading(true);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const response = await events.create(formData);
      if (response.data.success) {
        console.log('Create event response:', response.data);
        if (response.data && response.data.event_id) {
          return response.data;
        } else {
          throw new Error('Invalid response format: missing event_id');
        }
        toast.success('Event created successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
      
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create event');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleEventInterest = useCallback(
    async (eventId) => {
      try {
        await events.toggleInterested(eventId);
        const updatedEvents = interestedEvents.some((e) => e.id === eventId)
          ? interestedEvents.filter((e) => e.id !== eventId)
          : [...interestedEvents, { id: eventId }];
        setInterestedEvents(updatedEvents);
        toast.success('Event interest updated!');
      } catch (error) {
        toast.error('Failed to update event interest.');
        throw error;
      }
    },
    [interestedEvents, setInterestedEvents]
  );

  return {
    loading,
    trendingEvents,
    interestedEvents,
    fetchTrendingEvents,
    searchEvents,
    getEventById,
    createEvent,
    toggleEventInterest,
  };
}