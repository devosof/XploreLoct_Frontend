import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { locations } from '../../services/api';

export default function SearchFilters({ onSearch }) {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    place: ''
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await locations.getCountries();
        setCountries(data.data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!filters.country) {
        setCities([]);
        return;
      }
      try {
        const { data } = await locations.getCities(filters.country);
        setCities(data.data);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    fetchCities();
  }, [filters.country]);

  // Fetch places when city changes
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!filters.city) {
        setPlaces([]);
        return;
      }
      try {
        const { data } = await locations.getPlaces(filters.city);
        setPlaces(data.data);
      } catch (error) {
        console.error('Failed to fetch places:', error);
      }
    };
    fetchPlaces();
  }, [filters.city]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset dependent fields
      if (key === 'country') {
        newFilters.city = '';
        newFilters.place = '';
      } else if (key === 'city') {
        newFilters.place = '';
      }
      return newFilters;
    });
  };

  const handleSearch = () => {
    if (showFilters) {
      onSearch(filters);
    } else {
      onSearch({ query });
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    // Reset the other search method when switching
    if (!showFilters) {
      setQuery('');
    } else {
      setFilters({
        country: '',
        city: '',
        place: ''
      });
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end">
            <button
              onClick={toggleFilters}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Use Search Bar' : 'Use Filters'}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {!showFilters ? (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                <select
                  value={filters.country}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.country} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.city}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  disabled={!filters.country}
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city.city} value={city.city}>
                      {city.city}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.place}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => handleFilterChange('place', e.target.value)}
                  disabled={!filters.city}
                >
                  <option value="">Select Place</option>
                  {places.map(place => (
                    <option key={place.place} value={place.place}>
                      {place.place}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}