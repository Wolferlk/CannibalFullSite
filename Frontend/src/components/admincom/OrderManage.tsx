import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEdit, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [formData, setFormData] = useState(null);  // Make sure the formData starts as null
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("all");  // State to control the filter (all, completed, pending, canceled)
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  useEffect(() => {
    // Filter orders based on the selected filter
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);

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

  // Handle updating an order
  const handleUpdateOrder = async (e) => {
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
      if (editingOrder && editingOrder.id) {
        await axios.put(
          `http://localhost:5000/api/orders/${editingOrder.id}`,
          finalOrderData
        );
        toast.success("Order updated successfully!");
        setRefresh(!refresh);
        setFormData(null);
        setEditingOrder(null);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(
        `Error saving order: ${error.response?.data?.message || error.message}`
      );
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
    setFormData(null);
    setEditingOrder(null);
    setSelectedOrder(null);
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

  // Function to count orders by status
  const countOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const totalOrders = orders.length;
  const completedOrders = countOrdersByStatus("completed");
  const pendingOrders = countOrdersByStatus("pending");
  const cancelledOrders = countOrdersByStatus("cancelled");

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
        </div>
        
        {/* Display Order Counts with filter */}
        <div className="flex space-x-4 mb-4">
          <div 
            onClick={() => setFilter("all")}
            className={`cursor-pointer bg-blue-100 text-blue-800 px-4 py-2 rounded-lg ${filter === "all" ? "font-bold" : ""}`}
          >
            <strong>All Orders:</strong> {totalOrders}
          </div>
          <div 
            onClick={() => setFilter("completed")}
            className={`cursor-pointer bg-green-100 text-green-800 px-4 py-2 rounded-lg ${filter === "completed" ? "font-bold" : ""}`}
          >
            <strong>Completed:</strong> {completedOrders}
          </div>
          <div 
            onClick={() => setFilter("pending")}
            className={`cursor-pointer bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg ${filter === "pending" ? "font-bold" : ""}`}
          >
            <strong>Pending:</strong> {pendingOrders}
          </div>
          <div 
            onClick={() => setFilter("cancelled")}
            className={`cursor-pointer bg-red-100 text-red-800 px-4 py-2 rounded-lg ${filter === "cancelled" ? "font-bold" : ""}`}
          >
            <strong>Cancelled:</strong> {cancelledOrders}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          filteredOrders.map((order) => (
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

      {/* Right Panel: Order Details or Edit Form */}
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

              {/* Render cart items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Cart Items</h3>
                <ul className="space-y-2">
                  {formData.cartItems.length > 0 ? (
                    formData.cartItems.map((item, index) => (
                      <li key={index} className="flex justify-between text-gray-800">
                        <span>{item.productName} (x{item.quantity}) - {item.color}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-600">No items in cart</p>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate(`/order-edit/${selectedOrder._id}`)} // Redirect to the edit page
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaEdit size={16} className="mr-2" /> Edit
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">Please select an order to view details.</div>
        )}
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default OrderManage;
