import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCountries, fetchCitiesByCountry } from '../services/locationService';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    district: '',
    town: '',
    password: '',
    confirmPassword: '',
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedCountry) {
        const citiesData = await fetchCitiesByCountry(selectedCountry);
        setCities(citiesData);
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [selectedCountry]);

  const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const country = countries.find(c => c.name === formData.country);
      const phoneCode = country ? `+${country.phoneCode}` : '';
      
      // Only update if the value starts with the phone code
      if (value.startsWith(phoneCode)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => {
        const newFormData = {
          ...prev,
          [name]: value
        };

        // Check passwords when either password field changes
        if (name === 'password' || name === 'confirmPassword') {
          validatePasswords(
            name === 'password' ? value : prev.password,
            name === 'confirmPassword' ? value : prev.confirmPassword
          );
        }

        return newFormData;
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (e) => {
    const country = countries.find(c => c.name === e.target.value);
    setSelectedCountry(e.target.value);
    
    // Update phone code when country changes
    const newPhoneCode = country ? `${country.phoneCode}` : '';
    setPhoneCode(newPhoneCode);
    
    setFormData(prev => ({
      ...prev,
      country: e.target.value,
      city: '',
      phone: newPhoneCode // Set initial phone value with country code
    }));
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    const country = countries.find(c => c.name === formData.country);
    const phoneCode = country ? `${country.phoneCode}` : '';

    // Set the full phone number (code + input)
    setFormData(prev => ({
      ...prev,
      phone: phoneCode + inputValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords before submission
    if (!validatePasswords(formData.password, formData.confirmPassword)) {
      toast.error(passwordError);
      return;
    }

    if (!avatarFile) {
      toast.error('Profile picture is required');
      return;
    }

    try {
      const submitData = new FormData();
      
      // Add all text fields
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('country', formData.country);
      submitData.append('city', formData.city);
      submitData.append('district', formData.district);
      submitData.append('town', formData.town);
      submitData.append('password', formData.password);

      // Add the avatar file with the correct field name "avatar"
      submitData.append('avatar', avatarFile);

      // Log FormData contents for debugging
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await registerUser(submitData);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-green-800" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-800 hover:text-green-900">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Avatar Upload */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture (Required)
              </label>
              <div className="flex items-center space-x-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleCountryChange}
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

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {phoneCode}
                  </span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone.replace(phoneCode, '')} // Show only the number part
                  onChange={handlePhoneChange}
                  className="block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                disabled={!selectedCountry}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                required
                value={formData.district}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Town */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Town
              </label>
              <input
                type="text"
                name="town"
                required
                value={formData.town}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-green-500 focus:ring-green-500
                  ${passwordError ? 'border-red-300' : ''}`}
                minLength="6"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-green-500 focus:ring-green-500
                  ${passwordError ? 'border-red-300' : ''}`}
                minLength="6"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !!passwordError}
                className="w-full flex justify-center py-2 px-4 border border-transparent 
                  rounded-md shadow-sm text-sm font-medium text-white bg-green-800 
                  hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
