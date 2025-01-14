import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfileUpdatePage() {
  const navigate = useNavigate();

  // States for the form
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: '', // Allow image URL to be updated
    role: '', // Added role to the user object
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);  // Loading state for fetching user data

  // Fetch user data when the component is mounted
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ensure the token is available in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No token found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch the user profile data from API
        const response = await axios.get('http://localhost:5000/api/users/viewprofile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);
        } else {
          setMessage('Error fetching profile data');
        }
      } catch (error) {
        setMessage('Error fetching profile data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);  // Hide loading indicator when done
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array ensures this runs once on mount

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/edit/${user._id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Error updating profile.');
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/users/change-password', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setMessage('Password changed successfully!');
      } else {
        setMessage('Error changing password.');
      }
    } catch (error) {
      setMessage('Error changing password');
      console.error('Error changing password:', error);
    }
  };

  // Render loading state while fetching user data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Update Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Profile Image URL</label>
              <input
                type="text"
                value={user.profileImage}
                onChange={(e) => setUser({ ...user, profileImage: e.target.value })}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter image URL"
              />
              {user.profileImage && (
                <div className="mt-4">
                  <img src={user.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                </div>
              )}
            </div>

            <div className="mb-6">
              {user.role && (
                <>
                  <label className="block text-sm font-medium">Role</label>
                  <select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </>
              )}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Update Profile
            </button>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Change Your Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>

      {message && <p className="mt-6 text-center text-red-500">{message}</p>}
    </div>
  );
}
