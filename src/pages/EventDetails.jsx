import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import EventMap from '../components/events/EventMap';
import ReviewSection from '../components/events/ReviewSection';
import { events } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await events.getById(id);
        setEvent(data.data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await events.getReviews(id);
        setReviews(data.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchEventDetails();
    fetchReviews();
  }, [id]);

  const handleInterested = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await events.toggleInterested(id);
      setIsInterested(!isInterested);
    } catch (error) {
      console.error('Failed to toggle interest:', error);
    }
  };

  const handleSubmitReview = async (rating, comment) => {
    try {
      await events.addReview(id, { rating, comment });
      const { data } = await events.getReviews(id);
      setReviews(data.data);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (!event) {
    return <div className="min-h-screen bg-gray-50 pt-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="relative h-[40vh] bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
          alt={event.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold">{event.name}</h1>
            <p className="mt-2 text-lg">{event.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-800" />
                  <span>{new Date(event.details?.event_date).toLocaleDateString() || "Date not updated yet"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-800" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-800" />
                  <span>Capacity: {event.capacity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-800" />
                  <span>{event.address}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Location</h2>
                <EventMap location={event} />
                {console.log(event.google_maps_link)}
              </div>
            </div>

            <ReviewSection
              eventId={event.event_id}
              reviews={reviews}
              onSubmitReview={handleSubmitReview}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button
                onClick={handleInterested}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
                  isInterested
                    ? 'bg-green-100 text-green-800'
                    : 'bg-green-800 text-white hover:bg-green-900'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInterested ? 'fill-green-800' : ''}`} />
                <span>{isInterested ? 'Interested' : 'Mark as Interested'}</span>
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="mt-4 w-full px-4 py-2 border border-green-800 text-green-800 rounded-md hover:bg-green-50"
              >
                Contact Organizer
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Event Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Duration</dt>
                  <dd>{event.duration}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Frequency</dt>
                  <dd>{event.frequency}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Gender Allowance</dt>
                  <dd className="capitalize">{event.gender_allowance}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Organizer</dt>
                  <dd>{event.organizer.username}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Contact Organizer</h3>
            <p className="mb-4">
    
              Get in touch with {event.organizer.username} about this event:
              <br />
              <a
                href={`mailto:${event.organizer.contact || "#"}`}
                className="text-green-800 hover:underline"
              >
                {event.organizer.contact || "No contact information available"}
              </a>
            </p>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}