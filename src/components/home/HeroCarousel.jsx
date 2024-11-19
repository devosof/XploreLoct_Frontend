import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { events } from '../../services/api';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselEvents, setCarouselEvents] = useState([]);

  useEffect(() => {
    const fetchHeroEvents = async () => {
      try {
        const { data } = await events.getTrending();
        setCarouselEvents(data.data);
      } catch (error) {
        console.error('Failed to fetch hero events:', error);
        setCarouselEvents([]);
      }
    };

    fetchHeroEvents();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselEvents.length);
  }, [carouselEvents.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselEvents.length) % carouselEvents.length);
  }, [carouselEvents.length]);

  useEffect(() => {
    if (carouselEvents.length <= 1) return;

    const timer = window.setInterval(nextSlide, 5000);
    return () => window.clearInterval(timer);
  }, [nextSlide, carouselEvents.length]);

  if (!carouselEvents.length) return null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselEvents.map((event) => (
          <div key={event.event_id} className="min-w-full">
            <div className="relative h-full">
              <img
                src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"}
                alt={event.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-4xl font-bold">{event.name}</h2>
                  <p className="mt-2 text-lg">{event.description}</p>
                  <Link
                    to={`/events/${event.event_id}`}
                    className="mt-4 inline-block rounded-md bg-green-800 px-6 py-2 font-medium text-white transition-colors hover:bg-green-900"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {carouselEvents.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
            {carouselEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}