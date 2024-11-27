import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initial form data template for orders
const initialFormData = () => ({
  id: "",
  name: "",
  phone1: "",
  phone2: "",
  address: "",
  cartItems: [],
  totalAmount: 0,
  status: "pending",
});

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data.reverse());
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders.");
    }
  };

  // Handle adding or updating an order
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone1 ||
      !formData.address ||
      !formData.cartItems.length
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const finalOrderData = { ...formData };

    try {
      if (editingOrder) {
        await axios.put(
          `http://localhost:5000/api/orders/${editingOrder.id}`,
          finalOrderData
        );
        toast.success("Order updated successfully!");
      } else {
        const newOrder = { ...finalOrderData, id: Date.now().toString() };
        await axios.post("http://localhost:5000/api/orders", newOrder);
        toast.success("Order added successfully!");
      }
      resetForm();
      setRefresh(!refresh);
      if (selectedOrder) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(
        `Error saving order: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // Handle deleting an order
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        toast.success("Order deleted successfully!");
        setRefresh(!refresh);
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error(
          `Error deleting order: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  // Handle selecting an order to view details
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setFormData(order);
    setEditingOrder(order);
  };

  // Reset form and state
  const resetForm = () => {
    setFormData(initialFormData());
    setEditingOrder(null);
    setSelectedOrder(null);
  };

  // Handle status change from dropdown
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const updatedOrder = { ...selectedOrder, status: newStatus };
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder.id}`,
        updatedOrder
      );
      toast.success("Order status updated successfully!");
      setSelectedOrder(updatedOrder);
      setFormData(updatedOrder);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        `Error updating status: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // Function to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel: Order List */}
      <motion.div
        className="w-1/2 p-6 overflow-y-auto bg-white shadow-lg"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order List</h1>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transform transition-all duration-300"
            onClick={() => resetForm()}
            whileHover={{ scale: 1.05 }}
          >
            Add Order
          </motion.button>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order.id}
              className={`mb-4 p-4 rounded-lg shadow-md cursor-pointer border-l-4 ${getStatusColor(
                order.status
              )}`}
              onClick={() => handleSelectOrder(order)}
              whileHover={{ scale: 1.02, boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {order.name}
                  </h2>
                  <p className="text-gray-600">Phone: {order.phone1}</p>
                  <p className="text-gray-600">Address: {order.address}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Right Panel: Order Details or Add/Edit Form */}
      <motion.div
        className="w-1/2 p-6 overflow-y-auto bg-gray-50 shadow-lg"
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {selectedOrder ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <button
                onClick={() => resetForm()}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaEye size={20} /> Close
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-800">
                <strong>Name:</strong> {formData.name}
              </p>
              <p className="text-gray-800">
                <strong>Phone 1:</strong> {formData.phone1}
              </p>
              <p className="text-gray-800">
                <strong>Phone 2:</strong> {formData.phone2 || "N/A"}
              </p>
              <p className="text-gray-800">
                <strong>Address:</strong> {formData.address}
              </p>
              <p className="text-gray-800">
                <strong>Total Amount:</strong> ${formData.totalAmount.toFixed(2)}
              </p>
              <div className="flex items-center">
                <strong className="text-gray-800 mr-2">Status:</strong>
                <select
                  value={formData.status}
                  onChange={handleStatusChange}
                  className={`p-2 rounded-md ${getStatusColor(formData.status)} focus:outline-none`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <h2 className="text-xl font-semibold mt-4">Cart Items</h2>
                {formData.cartItems.length === 0 ? (
                  <p className="text-gray-600">No items in the cart.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {formData.cartItems.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item.quantity} x {item.productName} - $
                        {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleSelectOrder(selectedOrder)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-700 transition duration-300 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit Order
                </button>
                <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition duration-300 flex items-center"
                >
                  <FaTrashAlt className="mr-2" /> Delete Order
                </button>
              </div>
            </div>
          </>
        ) : editingOrder ? (
          // Edit Order Form
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              {editingOrder ? "Edit Order" : "Add Order"}
            </h1>
            <form onSubmit={handleAddOrUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone 1</label>
                  <input
                    type="text"
                    value={formData.phone1}
                    onChange={(e) =>
                      setFormData({ ...formData, phone1: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone 2</label>
                  <input
                    type="text"
                    value={formData.phone2}
                    onChange={(e) =>
                      setFormData({ ...formData, phone2: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Total Amount</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalAmount: parseFloat(e.target.value).toFixed(2),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Displaying cart items */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
                {formData.cartItems.length === 0 ? (
                  <p className="text-gray-600">No items in the cart.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {formData.cartItems.map((item, index) => (
                      <li key={index} className="mb-2 text-gray-700">
                        {item.quantity} x {item.productName} - $
                        {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-300"
                >
                  {editingOrder ? "Update Order" : "Add Order"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Default View: Add Order Form
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Order</h1>
            <form onSubmit={handleAddOrUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone 1</label>
                  <input
                    type="text"
                    value={formData.phone1}
                    onChange={(e) =>
                      setFormData({ ...formData, phone1: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone 2</label>
                  <input
                    type="text"
                    value={formData.phone2}
                    onChange={(e) =>
                      setFormData({ ...formData, phone2: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Total Amount</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalAmount: parseFloat(e.target.value).toFixed(2),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Displaying cart items */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
                {formData.cartItems.length === 0 ? (
                  <p className="text-gray-600">No items in the cart.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {formData.cartItems.map((item, index) => (
                      <li key={index} className="mb-2 text-gray-700">
                        {item.quantity} x {item.productName} - $
                        {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-300"
                >
                  {editingOrder ? "Update Order" : "Add Order"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default OrderManage;
