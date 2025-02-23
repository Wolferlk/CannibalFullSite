import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Upload, X } from 'lucide-react';

const AIItemFinder = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: files => {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file));
      mockSearchResults();
    }
  });

  const mockSearchResults = () => {
    setSearchResults([
      { id: 1, name: 'Premium Leather Jacket', price: 299, image: 'https://example.com/jacket.jpg' },
      { id: 2, name: 'Designer Silk Dress', price: 459, image: 'https://example.com/dress.jpg' },
      { id: 3, name: 'Vintage Denim Jeans', price: 189, image: 'https://example.com/jeans.jpg' },
      { id: 4, name: 'Luxury Wool Coat', price: 599, image: 'https://example.com/coat.jpg' },
    ]);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 opacity-50">
        <video 
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3129977/3129977-uhd_2560_1440_30fps.mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          AI Item Finder
        </h1>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12">
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-purple-500 bg-purple-50/50' : 'border-gray-300 hover:border-purple-400'}`}
          >
            {/* ... rest of the dropzone content ... */}
            <input {...getInputProps()} />
            
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Uploaded" 
                  className="max-h-96 w-full object-contain rounded-lg mb-4"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                    setSearchResults([]);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-purple-600 mx-auto" />
                <p className="text-xl text-gray-600">
                  {isDragActive ? 'Drop image here' : 'Drag & drop fashion item image, or click to select'}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Similar Items Found</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((item) => (
                  <div key={item.id} className="group relative bg-gray-50/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-purple-600 font-semibold">${item.price}</p>
                      <button className="mt-2 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIItemFinder;