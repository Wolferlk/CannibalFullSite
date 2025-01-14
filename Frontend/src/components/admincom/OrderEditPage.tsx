import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderEditPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone1: "",
    phone2: "",
    address: "",
    cartItems: [],
    totalAmount: 0,
    status: "pending",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch order details on load
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`
        );
        const fetchedOrder = response.data;
        setOrder(fetchedOrder);
        setFormData({
          name: fetchedOrder.name,
          phone1: fetchedOrder.phone1,
          phone2: fetchedOrder.phone2,
          address: fetchedOrder.address,
          cartItems: fetchedOrder.cartItems,
          totalAmount: fetchedOrder.totalAmount,
          status: fetchedOrder.status,
        });
      } catch (err) {
        setError("Error fetching order details.");
        toast.error("Failed to fetch order details!");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the change is for cart items
    if (name.startsWith("cartItem-")) {
      const index = parseInt(name.split("-")[1]);
      const field = name.split("-")[2];
      const newCartItems = [...formData.cartItems];
      newCartItems[index] = { ...newCartItems[index], [field]: value };
      setFormData({
        ...formData,
        cartItems: newCartItems,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle submitting the form with confirmation
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmUpdate = window.confirm(
      "Are you sure you want to update this order?"
    );
    
    if (!confirmUpdate) {
      return; // If the user cancels, do not proceed
    }

    setIsSubmitting(true);

    // Sanitize formData by replacing empty fields
    const sanitizedData = {
      ...formData,
      name: formData.name.trim() || "N/A",
      phone1: formData.phone1.trim() || "N/A",
      phone2: formData.phone2.trim() || "N/A",
      address: formData.address.trim() || "N/A",
      cartItems: formData.cartItems.map((item) => ({
        productName: item.productName.trim() || "N/A",
        color: item.color.trim() || "N/A",
        quantity: parseInt(item.quantity) || 0,
        price: parseFloat(item.price) || 0,
      })),
      totalAmount: parseFloat(formData.totalAmount) || 0,
    };

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, sanitizedData);
      
      toast.success("Order updated successfully!");

      // Ask where to go after update
      const navigateTo = window.confirm(
        "Order updated successfully! Do you want to go to Admin Dashboard or Homepage?"
      );

      if (navigateTo) {
        // User clicked "OK", navigate to Admin Dashboard
        navigate("/admin/dashboard");
      } else {
        // User clicked "Cancel", navigate to Homepage
        navigate("/");
      }

    } catch (err) {
      setError("Error updating order.");
      toast.error("Failed to update order!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting the order
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
      );
      
      if (!confirmDelete) {
        return; // If the user cancels, do not proceed
      }

      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      toast.success("Order deleted successfully!");
      navigate("/admin/dashboard"); // Navigate to dashboard after deletion
    } catch (err) {
      setError("Error deleting order.");
      toast.error("Failed to delete order!");
    }
  };

  // Handle the Back button click
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  if (!order) {
    return <p className="text-center text-xl text-gray-500">Loading order...</p>;
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl bg-gray-900 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Order</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Left Side - Order Details */}
        <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-white">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="phone1" className="block text-lg font-medium text-white">
              Phone Number 1
            </label>
            <input
              type="text"
              id="phone1"
              name="phone1"
              value={formData.phone1}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="phone2" className="block text-lg font-medium text-white">
              Phone Number 2
            </label>
            <input
              type="text"
              id="phone2"
              name="phone2"
              value={formData.phone2}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-lg font-medium text-white">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-lg font-medium text-white">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Right Side - Cart Items */}
        <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white">Cart Items</h3>
          {formData.cartItems.length > 0 ? (
            formData.cartItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 bg-gray-700 p-4 rounded-md border border-gray-600"
              >
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor={`cartItem-${index}-productName`}
                    className="text-lg font-medium text-white"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id={`cartItem-${index}-productName`}
                    name={`cartItem-${index}-productName`}
                    value={item.productName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
                  />

                  <label
                    htmlFor={`cartItem-${index}-color`}
                    className="text-lg font-medium text-white"
                  >
                    Color
                  </label>
                  <input
                    type="text"
                    id={`cartItem-${index}-color`}
                    name={`cartItem-${index}-color`}
                    value={item.color}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
                  />
                </div>

                <div className="flex flex-col w-1/4">
                  <label
                    htmlFor={`cartItem-${index}-quantity`}
                    className="text-lg font-medium text-white"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`cartItem-${index}-quantity`}
                    name={`cartItem-${index}-quantity`}
                    value={item.quantity}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
                  />

                  <label
                    htmlFor={`cartItem-${index}-price`}
                    className="text-lg font-medium text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id={`cartItem-${index}-price`}
                    name={`cartItem-${index}-price`}
                    value={item.price}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No items in cart.</p>
          )}

          <div>
            <label
              htmlFor="totalAmount"
              className="block text-lg font-medium text-white"
            >
              Total Amount
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white"
              readOnly
            />
          </div>
        </div>
      </form>

      <div className="flex gap-6 mt-6">
        <button
          type="submit"
          className={`w-full py-3 text-white font-semibold rounded-md ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Updating..." : "Update Order"}
        </button>
        <button
          onClick={handleBack}
          className="w-full py-3 text-white font-semibold rounded-md bg-gray-600 hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleDelete}
          className="w-full py-3 text-white font-semibold rounded-md bg-red-600 hover:bg-red-700"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
}
