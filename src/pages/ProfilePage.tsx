import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Languages, Camera, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { countries } from '../data/countries';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const ProfileContent: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentCountry: user?.currentCountry || '',
    preferredLanguage: user?.preferredLanguage || '',
    avatarUrl: user?.avatarUrl || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        currentCountry: user.currentCountry,
        preferredLanguage: user.preferredLanguage,
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }
    
    setIsSaving(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        currentCountry: user.currentCountry,
        preferredLanguage: user.preferredLanguage,
        avatarUrl: user.avatarUrl || ''
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  // Generate a default avatar based on user's name
  const getDefaultAvatar = (name: string): string => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Use a service that generates avatars based on initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=ffffff&size=200&font-size=0.6`;
  };

  const displayAvatar = formData.avatarUrl || (user ? getDefaultAvatar(user.name) : '');

  if (!user) return null;

  return (
    <main className="pt-28 pb-16">
      <div className="container-custom max-w-4xl">
        <div className="mb-6">
          <Link 
            to="/community" 
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Community</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img
                  src={displayAvatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Camera size={24} className="text-white" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold font-display">{user.name}</h1>
                <p className="text-primary-100 mt-1">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    📍 {user.currentCountry}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    🗣️ {user.preferredLanguage}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    ⭐ {user.membershipType === 'premium' ? 'Premium' : 'Free'} Member
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-200' 
                  : 'bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-display text-neutral-800 dark:text-neutral-100">
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className={`btn-primary flex items-center space-x-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <Save size={18} />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="currentCountry" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Current Country
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <select
                        id="currentCountry"
                        name="currentCountry"
                        value={formData.currentCountry}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        required
                      >
                        <option value="">Select your current country</option>
                        {countries.map(country => (
                          <option key={country.id} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferredLanguage" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Preferred Language for Homeschooling
                    </label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <select
                        id="preferredLanguage"
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        required
                      >
                        <option value="">Select preferred language</option>
                        <option value="English">English</option>
                        <option value="German">German</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Italian">Italian</option>
                        <option value="Dutch">Dutch</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Profile Picture URL (Optional)
                  </label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="url"
                      id="avatarUrl"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Leave empty to use a generated avatar based on your name.
                  </p>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Full Name</h3>
                    <p className="text-lg text-neutral-800 dark:text-neutral-100">{user.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Email Address</h3>
                    <p className="text-lg text-neutral-800 dark:text-neutral-100">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Member Since</h3>
                    <p className="text-lg text-neutral-800 dark:text-neutral-100">
                      {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Current Country</h3>
                    <p className="text-lg text-neutral-800 dark:text-neutral-100">{user.currentCountry}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Preferred Language</h3>
                    <p className="text-lg text-neutral-800 dark:text-neutral-100">{user.preferredLanguage}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Membership Type</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.membershipType === 'premium' 
                        ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-200' 
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200'
                    }`}>
                      {user.membershipType === 'premium' ? '⭐ Premium' : '🆓 Free'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;