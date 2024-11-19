import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { events, users } from '../../services/api.js';

export default function EventCard({ event, featured = false }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isInterested, setIsInterested] = useState(false);

  // Check if user has marked this event as interested
  useEffect(() => {
    const checkInterestStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const { data } = await users.getInterestedEvents();
          const isEventInterested = data.data.some(
            (interestedEvent) => interestedEvent.event_id === event.event_id
          );
          setIsInterested(isEventInterested);
        } catch (error) {
          console.error('Failed to check interest status:', error);
        }
      }
    };

    checkInterestStatus();
  }, [event.event_id, isAuthenticated, user]);

  const handleInterested = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await events.toggleInterested(event.event_id);
      setIsInterested(!isInterested);
      toast.success(isInterested ? 'Removed from interested events' : 'Added to interested events');
    } catch (error) {
      toast.error('Failed to update interest');
    }
  };

  return (
    <Link
      to={`/events/${event.event_id}`}
      className={`group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? 'col-span-2 row-span-2' : ''
      }`}
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-800">
          {event.name}
        </h3>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.event_date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.address}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.interest_count} interested</span>
          </div>
        </div>

        <button
          onClick={handleInterested}
          className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isInterested
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-green-800 text-white hover:bg-green-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Heart className={`h-4 w-4 ${isInterested ? 'fill-green-800' : ''}`} />
            <span>{isInterested ? 'Interested' : 'Mark as Interested'}</span>
          </div>
        </button>
      </div>
    </Link>
  );
}