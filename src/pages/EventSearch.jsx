import React, { useState } from 'react';
import SearchFilters from '../components/events/SearchFilters';
import EventCarousel from '../components/events/EventCarousel';
import { events } from '../services/api';

export default function EventSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      let endpoint;
      let params;

      if ('query' in searchParams) {
        // Text search - use /events/search
        endpoint = 'searchByQuery';
        params = { query: searchParams.query };
      } else {
        // Filter search - use /events
        endpoint = 'searchByLocation';
        params = {
          country: searchParams.country,
          city: searchParams.city,
          place: searchParams.place
        };
      }

      const { data } = await events[endpoint](params);
      setSearchResults(data.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Failed to search events:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <SearchFilters onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
          </div>
        ) : (
          <div className="space-y-8">
            {hasSearched ? (
              searchResults.length > 0 ? (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h2>
                  <EventCarousel events={searchResults} />
                </section>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No events found matching your criteria.</p>
                  <button
                    onClick={() => setHasSearched(false)}
                    className="mt-4 text-green-800 hover:text-green-900 font-medium"
                  >
                    View all events
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Search results will be shown here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}