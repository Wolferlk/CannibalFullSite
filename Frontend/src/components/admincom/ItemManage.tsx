import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Icons for actions
import { ToastContainer, toast } from 'react-toastify'; // For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing Toast CSS

// Initial form data template with three states for status
const initialFormData = () => ({
  id: '',
  name: '',
  price: '',
  description: '',
  category: '',
  images: [], // handle image URLs (string array)
  sizes: [],
  colors: [],
  quantity: 0,
  status: 'available', // Default to 'available'
});

const ItemManage = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle adding or updating a product
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    const finalProductData = { ...formData };

    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/products/${editingItem.id}`, finalProductData);
        toast.success('Item updated successfully!');
      } else {
        const newProduct = { ...finalProductData, id: Date.now().toString() };
        await axios.post('http://localhost:5000/api/products', newProduct);
        toast.success('Item added successfully!');
      }
      resetForm();
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Error saving item.');
    }
  };

  // Handle delete product action
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success('Item deleted successfully!');
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error deleting item.');
      }
    }
  };

  // Reset form and state
  const resetForm = () => {
    setFormData(initialFormData());
    setEditingItem(null);
    setShowForm(false);
  };

  // Handle image URL change
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.value.split(',').map((url) => url.trim()), // Accept multiple URLs separated by commas
    });
  };

  return (
    <div className="p-8 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Item Management</h1>
      </motion.div>

      <motion.button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transform transition-all duration-300"
        onClick={() => setShowForm(!showForm)}
        whileHover={{ scale: 1.05 }}
      >
        {showForm ? 'Close Form' : 'Add Item'}
      </motion.button>

      {showForm && (
        <motion.div
          className="mt-6 p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">{editingItem ? 'Update Item' : 'Add Item'}</h2>
          <form onSubmit={handleAddOrUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="mens">Mens</option>
                  <option value="womens">Womens</option>
                  <option value="caps">Caps</option>
                  <option value="bags">Bags</option>
                  <option value="shoes">Shoes</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              {/* Handle sizes and colors */}
              <div>
                <label className="block text-gray-700">Sizes</label>
                <input
                  type="text"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map((size) => size.trim()) })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. S, M, L"
                />
              </div>
              <div>
                <label className="block text-gray-700">Colors</label>
                <input
                  type="text"
                  value={formData.colors.join(', ')}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map((color) => color.trim()) })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Red, Blue"
                />
              </div>
            </div>

            {/* Image URL input */}
            <div className="mt-6">
              <label className="block text-gray-700">Images (URLs)</label>
              <input
                type="text"
                value={formData.images.join(', ')}
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. http://example.com/image1.png, http://example.com/image2.png"
              />
            </div>

            {/* Status dropdown */}
            <div className="mt-6">
              <label className="block text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="available">Available</option>
                <option value="low-stock">Low Stock</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transform transition-all duration-300"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transform transition-all duration-300"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.table
        className="mt-8 w-full bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <motion.tr
              key={item.id}
              className="border-b hover:bg-gray-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">LKR {item.price.toFixed(2)}</td>
              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 rounded-full ${
                    item.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : item.status === 'low-stock'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-3 flex space-x-4">
                <button
                  className="text-blue-500 hover:text-blue-600 transform transition-all duration-300"
                  onClick={() => {
                    setEditingItem(item);
                    setFormData(item);
                    setShowForm(true);
                  }}
                >
                  <FaEdit className="inline-block mr-2" /> Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-600 transform transition-all duration-300"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrashAlt className="inline-block mr-2" /> Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <ToastContainer /> {/* Toast notification container */}
    </div>
  );
};

export default ItemManage;
