import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Calendar, MapPin, User, Phone, Mail, Briefcase, GraduationCap, Plus, PencilIcon } from 'lucide-react';
import EventCard from '../components/home/EventCard';
import { users } from '../services/api';
import { organizers, speakers } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    city: user?.city || '',
    district: user?.district || '',
    town: user?.town || '',
    address: user?.address || '',
    profession: user?.profession || '',
    education: user?.education || '',
    age: user?.age || '',
    avatarForPublicId: user?.avatar_url || '',
  });
  const [organizerDetails, setOrganizerDetails] = useState(null);
  const [interestedEvents, setInterestedEvents] = useState([]);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [organizationKey, setOrganizationKey] = useState('');
  const [speakerBio, setSpeakerBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await users.getProfile();
        setProfile(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(data.data).map(([key, value]) => [key, value ?? ''])
          )
        }));
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    const fetchOrganizerDetails = async () => {
      if (user?.role?.includes('organizer')) {
        try {
          const { data } = await organizers.getProfile();
          console.log('Organizer details:', data);
          setOrganizerDetails(data.data);
        } catch (error) {
          console.error('Error fetching organizer details:', error);
          toast.error('Failed to load organizer details');
        }
      }
    };

    const fetchOrganizerEvents = async () => {
      if (user?.role?.includes('organizer')) {
        try {
          const { data } = await organizers.getEvents();
          setOrganizerEvents(data.data);
        } catch (error) {
          console.error('Error fetching organizer events:', error);
          toast.error('Failed to load organizer events');
        }
      }
    };

    const fetchInterestedEvents = async () => {
      try {
        const { data } = await users.getInterestedEvents();
        setInterestedEvents(data.data);
      } catch (error) {
        toast.error('Failed to load interested events');
      }
    };

    fetchProfile();
    fetchOrganizerDetails();
    fetchOrganizerEvents();
    fetchInterestedEvents();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = Object.fromEntries(
        Object.entries(profile).map(([key, value]) => [key, value || null])
      );
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        if (profile.avatarForPublicId) {
          formData.append('old_avatar_public_id', profile.avatarForPublicId);
        }
        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== null) {
            formData.append(key, value);
          }
        });
        
        await users.updateProfileWithAvatar(formData);
      } else {
        await users.updateProfile(profileData);
      }
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setAvatarFile(null);
      
      const { data } = await users.getProfile();
      setProfile(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(data.data).map(([key, value]) => [key, value ?? ''])
        )
      }));
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case 'organizer':
        return 'bg-blue-100 text-blue-800';
      case 'speaker':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOrganizerRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await organizers.register({ organizationKey });
      toast.success('Successfully registered as an organizer. Please login again.');
      setShowOrganizerModal(false);
      setOrganizationKey('');
      // Logout the user
      await auth.logout();
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'No organization found');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpeakerRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await speakers.register({ bio: speakerBio });
      toast.success('Successfully registered as a speaker. Please login again.');
      setShowSpeakerModal(false);
      setSpeakerBio('');
      // Logout the user
      await auth.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Speaker registration error:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to register as speaker. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.username}`}
                  alt={user?.username}
                  className="mx-auto h-24 w-24 rounded-full"
                />
                <h2 className="mt-4 text-xl font-semibold">{user?.username}</h2>
                {console.log('User:', user)}
                {console.log('User roles:', user?.role)}
                
                {Array.isArray(user?.role) && user.role.length > 0 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {user.role.map((role, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeClass(role)}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{profile.phone || "Not available"}</span>
                </div>
                {profile.profession && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Briefcase className="h-5 w-5" />
                    <span>{profile.profession}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <GraduationCap className="h-5 w-5" />
                    <span>{profile.education}</span>
                  </div>
                )}
                {(profile.country || profile.city || profile.district || profile.town) && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {[profile.town, profile.district, profile.city, profile.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-6 w-full px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
              {!user?.role?.includes('organizer') && (
                <button
                  onClick={() => setShowOrganizerModal(true)}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register as Organizer
                </button>
              )}
              {!user?.role?.includes('speaker') && (
                <button
                  onClick={() => setShowSpeakerModal(true)}
                  className="mt-2 w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Register as Speaker
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <div className="mt-2 flex items-center space-x-6">
                      <div className="relative">
                        <img
                          src={avatarPreview || user?.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                          alt="Avatar preview"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-100"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-600" />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(user?.avatar_url);
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        value={profile.age}
                        onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profession</label>
                      <input
                        type="text"
                        value={profile.profession}
                        onChange={(e) => setProfile((p) => ({ ...p, profession: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Education</label>
                      <input
                        type="text"
                        value={profile.education}
                        onChange={(e) => setProfile((p) => ({ ...p, education: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <input
                        type="text"
                        value={profile.country}
                        onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">District</label>
                      <input
                        type="text"
                        value={profile.district}
                        onChange={(e) => setProfile((p) => ({ ...p, district: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Town</label>
                      <input
                        type="text"
                        value={profile.town}
                        onChange={(e) => setProfile((p) => ({ ...p, town: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Username</h4>
                      <p className="mt-1 text-lg font-medium">{profile.username}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-lg font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="mt-1 text-lg font-medium">{profile.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Age</h4>
                      <p className="mt-1 text-lg font-medium">{profile.age}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Profession</h4>
                      <p className="mt-1 text-lg font-medium">{profile.profession}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Education</h4>
                      <p className="mt-1 text-lg font-medium">{profile.education}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Country</h4>
                      <p className="mt-1 text-lg font-medium">{profile.country}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">City</h4>
                      <p className="mt-1 text-lg font-medium">{profile.city}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">District</h4>
                      <p className="mt-1 text-lg font-medium">{profile.district}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Town</h4>
                      <p className="mt-1 text-lg font-medium">{profile.town}</p>
                    </div>
                  </div>
                </div>

                {organizerDetails && organizerDetails.organization && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6 flex justify-between items-center">
                      <p className="text-lg text-gray-600">
                        You are organizer for <span className="font-semibold text-green-800">{organizerDetails.organization.name}</span>
                      </p>
                      <Link
                        to="/events/create"
                        className="inline-flex items-center px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Event
                      </Link>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={organizerDetails.organization.logo_url || `https://ui-avatars.com/api/?name=${organizerDetails.organization?.name}`}
                          alt={organizerDetails.organization.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Organization Name</h4>
                          <p className="mt-1 text-lg font-medium">{organizerDetails.organization.name}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Contact Email</h4>
                            <p className="mt-1">{organizerDetails.organization.contact_email}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Contact Phone</h4>
                            <p className="mt-1">{organizerDetails.organization.contact_phone}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Address</h4>
                          <p className="mt-1">{organizerDetails.organization.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role?.includes('organizer') && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Events You've Created</h3>
                      {/* <Link
                        to="/events/create"
                        className="inline-flex items-center px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Event
                      </Link> */}
                    </div>
                    
                    {organizerEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {organizerEvents.map((event) => (
                          <div 
                            key={event.event_id} 
                            className="relative border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900">{event.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(event.event_date).toString() !== 'Invalid Date'
                                    ? new Date(event.event_date).toLocaleDateString()
                                    : 'Date not updated yet'}
                                </p>

                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{event.address}</span>
                                </div>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                              
                              <Link
                                to={`/events/${event.event_id}/edit`}
                                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </div>

                            <div className="mt-3">
                              <div className="flex items-center space-x-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {event.frequency}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Capacity: {event.capacity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        You haven't created any events yet.
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Interested Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interestedEvents.map((event) => (
                      <EventCard key={event.event_id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showOrganizerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Register as Organizer</h3>
              <form onSubmit={handleOrganizerRegistration}>
                <div className="mt-2">
                  <input
                    type="text"
                    value={organizationKey}
                    onChange={(e) => setOrganizationKey(e.target.value)}
                    placeholder="Enter Organization Key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowOrganizerModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showSpeakerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Register as Speaker</h3>
              <form onSubmit={handleSpeakerRegistration}>
                <div className="mt-2">
                  <textarea
                    value={speakerBio}
                    onChange={(e) => setSpeakerBio(e.target.value)}
                    placeholder="Enter your bio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    rows="4"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSpeakerModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
