import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Scrolling from '../components/Scrollimg';
import Reviews from '../components/Reviews';
import Screens from '../components/Screenshot';
import axios from 'axios';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);







  // Fetch the latest 3 products
 useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products'); // Fetch latest 3 products
        setFeaturedProducts(response.data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <Hero />
      <Scrolling />
      
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Collection</h2>
        
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Reviews />

      <div className="g-post" data-href="https://plus.google.com/+myCompanyName/posts/C5mXxBfvuyQ"></div>
      <script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>

      <section className="bg-black text-white py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Our Philosophy</h2>
          <p className="text-xl max-w-2xl mx-auto">
            At Cannibal.co, we believe in the power of minimalist design and superior quality.
            Every piece tells a story of urban culture and contemporary lifestyle.
          </p>
        </div>
      </section>
    </div>
  );
}
