import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/home/HeroCarousel';
import EventCard from '../components/home/EventCard';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { events } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    const fetchRandomEvents = async () => {
      try {
        const { data } = await events.getRandom();
        console.log(data);
        setTrendingEvents(data.data);
      } catch (error) {
        console.error('Failed to fetch trending events:', error);
      }
    };

    fetchRandomEvents();
  }, []);

  return (
    <div className="flex flex-col">
      <HeroCarousel />


      <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Event</h2>
            <p className="mt-4 text-lg text-gray-600">
              Search through our extensive collection of events or use filters to find exactly what you're looking for
            </p>
            <button
              onClick={() => navigate('/events')}
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Events
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">More Events</h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover the most popular events happening near you
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trendingEvents.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </div>
      </section>



      <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
              <p className="mt-4 text-lg text-gray-600">
                XploreLoct is your gateway to discovering amazing events and connecting with like-minded
                people. Whether you're looking for conferences, workshops, or social gatherings, we've
                got you covered.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm">
                  <Calendar className="h-8 w-8 text-green-800" />
                  <h3 className="mt-2 font-semibold">Events</h3>
                  <p className="text-center text-sm text-gray-600">
                    Find events that match your interests
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm">
                  <MapPin className="h-8 w-8 text-green-800" />
                  <h3 className="mt-2 font-semibold">Locations</h3>
                  <p className="text-center text-sm text-gray-600">
                    Discover events happening near you
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm">
                  <Users className="h-8 w-8 text-green-800" />
                  <h3 className="mt-2 font-semibold">Community</h3>
                  <p className="text-center text-sm text-gray-600">
                    Connect with like-minded people
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80"
                alt="People enjoying an event"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}