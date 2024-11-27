// Cart.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';


export default function Cart() {
  const { state, dispatch } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    navigate('/checkout', {
      state: {
        cartItems,
        total,
      },
    });
    console.log();
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

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
