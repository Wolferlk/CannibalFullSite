import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Confirmation from './Confirmation';
import axios from 'axios';
import { CheckCircle } from 'lucide-react'; // Import the check icon

export default function Cart() {
  const { state, dispatch } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Control success popup visibility
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
  });
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const productIds = state.items.map((item) => item.productId);
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { ids: productIds.join(',') },
        });

        const updatedCartItems = state.items.map((item) => {
          const product = response.data.find((p) => p._id === item.productId);
          return { ...item, product };
        });
        setCartItems(updatedCartItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [state.items]);

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleCheckout = () => {
    setShowModal(true); // Show the modal on checkout button click
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      cartItems: cartItems.map((item) => ({
        productName: item.product?.name,
        quantity: item.quantity,
        color: item.product?.color || 'N/A',
        price: item.product?.price,
      })),
      totalAmount: total,
    };

    try {
      await axios.post('http://localhost:5000/api/orders', orderData);
      setShowModal(false); // Close the modal after successful order submission
      setShowSuccessPopup(true); // Show the success popup
      console.log('Order Data sent successfully');
      // You can also redirect or navigate after a timeout
      setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order.');
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false); // Close success popup
    navigate('/'); // Navigate to home page
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setCartItems([]);
  };

  const handleAddMoreItems = () => {
    navigate('/store'); // Navigate to the store page to add more items
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/store"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <img
                    src={item.product?.images[0]}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product?.name}</h3>
                    <p className="text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="font-medium">LKR {item.product?.price}</p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: {
                                  productId: item.productId,
                                  quantity: item.quantity - 1,
                                },
                              });
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: {
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              },
                            })
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_ITEM',
                            payload: item.productId,
                          })
                        }
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>LKR {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="block w-full bg-black text-white text-center py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>

                {/* Additional Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleAddMoreItems}
                    className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Add More Items
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for user input */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Full Name"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleFormChange}
                    placeholder="Phone Number 1"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleFormChange}
                    placeholder="Phone Number 2 (optional)"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 text-white py-2 px-6 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-black text-white py-2 px-6 rounded-full"
                    >
                      Submit Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Your order was confirmed successfully!</h2>
              <p className="text-gray-600 mb-4">
                Our agent will call you, and within 3 days, your order will be placed.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-black text-white py-2 px-6 rounded-full"
                >
                  Home Page
                </button>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="bg-black text-white py-2 px-6 rounded-full"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
