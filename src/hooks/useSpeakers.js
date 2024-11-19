import { useState, useEffect } from 'react';
import { speakers } from '../services/api';
import {organizers} from '../services/api';
import { toast } from 'react-toastify';

export default function useSpeakers() {
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const { data } = await organizers.getSpeakers();
        setAvailableSpeakers(data.data);
      } catch (error) {
        toast.error('Failed to load speakers');
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  return { availableSpeakers, loading };
}