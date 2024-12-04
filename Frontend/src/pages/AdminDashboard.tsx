import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import ItemManage from '../components/admincom/ItemManage';
import PhotosManage from '../components/admincom/ManagePhotos';
import OrderManage from '../components/admincom/OrderManage';
import Messages from '../components/admincom/ManageMessages';
import AddUserComponent from '../components/admincom/AddUserComponent';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('item-manage');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  
  // Check if the user is an admin when the component mounts
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('token');
    
    if (!isAdmin || !token) {
      navigate('/admin'); // Redirect to login if not admin or token is missing
    }

    fetchUserData(); // Fetch user data for the sidebar
    fetchProducts(); // Fetch product data
  }, [navigate]);

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.get('http://localhost:5000/api/users/viewuser', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      setError('Error fetching user details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products (example)
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products');
    }
  };

  // Handle section navigation in the sidebar
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-gray-800 text-white flex flex-col p-6 top-5 left-0 h-full"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="mb-6">
          {/* Display User Info */}
          <img
                src={''}
                alt="Admin"
                className="w-16 h-16 rounded-full"
              />
          {userData && (
            <div className="flex items-center">
              
              <img
                src={userData.profileImage || 'https://via.placeholder.com/100'}
                alt="Admin"
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4">
                <p className="text-lg font-bold">{userData.name || 'Invalid login'}</p>
                <p className="text-sm text-gray-400">{userData.role || 'Invalid login'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Menu */}
        {['item-manage', 'photos-manage', 'order-manage', 'messages', 'User Manager'].map((section) => (
          <motion.button
            key={section}
            onClick={() => handleSectionClick(section)}
            className={`py-2 px-4 text-left rounded-lg w-full mb-2 ${
              activeSection === section ? 'bg-gray-700' : 'hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {section.replace('-', ' ')}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Section Content */}
        <AnimatePresence>
          {activeSection === 'item-manage' && (
            <motion.div
              key="item-manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ItemManage />
            </motion.div>
          )}
          {activeSection === 'photos-manage' && (
            <motion.div
              key="photos-manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PhotosManage />
            </motion.div>
          )}
          {activeSection === 'order-manage' && (
            <motion.div
              key="order-manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrderManage />
            </motion.div>
          )}
          {activeSection === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Messages />
            </motion.div>
          )}
          {activeSection === 'User Manager' && (
            <motion.div
              key="User Manager"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AddUserComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
