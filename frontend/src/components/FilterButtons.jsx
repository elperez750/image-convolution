import React, { useState } from "react";
import ThresholdControl from "./ThresholdControl";
import LoadingIndicator from "./LoadingIndicator";
import { useImageProcessingContext } from "../context/ImageProcessingContext";

const effects = [
  "blur",
  "sharpen",
  "contrast",
  "invert",
  "black and white",
  "red channel",
  "green channel",
  "blue channel",
  "laplacian",
];

const FilterButtons = () => {
  const {
    outputImage,
    filter,
    setFilter,
    image,
    imageLoaded,
    setImage,
    handleImageProcessing,
    downloadImage
  } = useImageProcessingContext();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        {image ? (
          <>
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Choose Filter
                </h1>
                <p className="text-gray-500 text-sm">
                  Select an effect to apply to your image
                </p>
              </div>
            </div>

            <div className="grid grid-flow-row grid-cols-2 mb-6 gap-2">
              {effects.map((effect) => (
                <button
                  key={effect}
                  onClick={() => setFilter(effect)}
                  className={`cursor-pointer flex items-center justify-center py-2 px-4 font-medium rounded-lg shadow transition w-full text-center ${
                    filter === effect
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white ring-2 ring-blue-500 ring-offset-2"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  }`}
                >
                  {effect[0].toLocaleUpperCase() + effect.slice(1)}
                </button>
              ))}
            </div>

            {filter === "black and white" && <ThresholdControl />}
            
            <div className="flex justify-center mb-6">
              <button
                onClick={handleImageProcessing}
                className="cursor-pointer flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition w-full text-center"
              >
                <svg 
                  className="h-5 w-5 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828l-3.172-3.172a2 2 0 00-2.828 0L8 8.243V16.5z" clipRule="evenodd" />
                </svg>
                Apply Filter
              </button>
            </div>

            {outputImage && (
              <div>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Processed Image</span>
                  </div>
                  <div className="p-2">
                    <img className="w-full rounded-lg" src={outputImage.url} alt="Processed" />
                  </div>
                </div>

                {imageLoaded && (
                  <button 
                    onClick={downloadImage}
                    className="mt-6 cursor-pointer flex items-center justify-center py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-600 transition w-full text-center"
                  >
                    <svg 
                      className="h-5 w-5 mr-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Image
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div>
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Get Started
                </h1>
                <p className="text-gray-500 text-sm">
                  Upload an image to apply filters
                </p>
              </div>
            </div>
            
            <label
              htmlFor="select-image"
              className="cursor-pointer flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition w-full text-center"
            >
              <svg 
                className="h-5 w-5 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Select Image
              <input
                id="select-image"
                name="select-image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterButtons;