import React, { useState } from "react";
import { ArrowRight, Phone, MapPin, Mail, Globe, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend API
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", title: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src="https://i.ibb.co/Jr49Jdf/DSC04736.png"
          alt="Contact Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Contact Us</h1>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Feel free to reach out to us through any of the options below. We're here
              to assist you.
            </p>
            <ul className="space-y-6 text-gray-800">
              <li className="flex items-center gap-4">
                <Phone className="text-black w-6 h-6" />
                <span>+9478 289 8993</span>
              </li>
              <li className="flex items-center gap-4">
                <MapPin className="text-black w-6 h-6" />
                <span>Suramya, Dewagoda, Madampe, Ambalangoda, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-black w-6 h-6" />
                <a
                  href="mailto:support@cannible.co"
                  className="text-black hover:underline"
                >
                  support@cannible.co
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Globe className="text-black w-6 h-6" />
                <a
                  href="https://www.cannible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  www.cannible.co
                </a>
              </li>
              <li className="flex items-center gap-4">
                <MessageCircle className="text-black w-6 h-6" />
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  Chat with us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-4xl font-bold mb-6">Follow Us</h3>
            <div className="flex gap-6 text-3xl">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 shadow-md rounded-lg p-8">
          <h2 className="text-4xl font-bold mb-8">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-800 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-gray-800 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-800 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                rows="5"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Send Message <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
