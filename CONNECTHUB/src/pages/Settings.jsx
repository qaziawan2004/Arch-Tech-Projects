import React, { useState } from 'react';
import Navbar from '../Components/layout/Navbar';
import Sidebar from '../Components/layout/Sidebar';
import InputField from '../Components/ui/InputField';
import Button from '../Components/ui/Button';

const Settings = () => {
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software Developer',
    isPrivate: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // TODO: Call API to update settings
      console.log('Settings saved:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <form onSubmit={handleSubmit} className="card space-y-4">
            <InputField
              label="Full Name"
              name="name"
              value={settings.name}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Email"
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={settings.bio}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPrivate"
                checked={settings.isPrivate}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">Private Account</label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;