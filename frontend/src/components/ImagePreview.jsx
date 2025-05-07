import React, { useState } from "react";
import { useImageProcessingContext } from "../context/ImageProcessingContext";
import { motion } from "react";

const ImagePreview = () => {
  const { image, deleteImage } = useImageProcessingContext();
  const [isHovering, setIsHovering] = useState(false);

  // Animation variants for hover effects
  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    initial: { scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Preview
            </h1>
            <p className="text-gray-500 text-sm">Upload an image to begin processing</p>
          </div>
        </div>

        {image ? (
          <div className="mb-6">
            <div 
              className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 p-1 shadow-inner"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className={`rounded-lg overflow-hidden transition-all duration-300 ${isHovering ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}`}>
                <img
                  alt="Preview"
                  className="object-contain w-full h-64 transition-all duration-500"
                  src={URL.createObjectURL(image)}
                />
              </div>
              
              {isHovering && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-center p-4">
                    <p className="font-medium">Click to process</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-xs">
                  {image.name}
                </span>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {(image.size / 1024).toFixed(1)} KB
              </span>
            </div>

            <button
              onClick={deleteImage}
              className="mt-5 w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg 
                className="h-5 w-5 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              Remove Image
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center mb-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
            <div className="mb-4 p-4 bg-blue-50 rounded-full">
              <svg
                className="h-16 w-16 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-700 mb-2">No Image Selected</h3>
            <p className="text-gray-500 text-center text-sm mb-4">
              Upload an image to preview and process
            </p>
            
          </div>
        )}
        
        {image && (
          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg 
                className="h-4 w-4 text-yellow-500 mr-1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Ready to apply convolution filters</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;