import React from "react";
import ImagePreview from "./ImagePreview";
import FilterButtons from "./FilterButtons";
import { useImageProcessingContext } from "../context/ImageProcessingContext";
import LoadingIndicator from "./LoadingIndicator";
import SimpleProgressBar from "./SimpleProgressBar";

const UploadImage = () => {
  const { isImageLoading, isStreamingImageLoading, percentage } = useImageProcessingContext();
  
  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Full height and width container */}
      <div className="flex-1 flex items-stretch p-4 md:p-8">
        <div className="w-full flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-lg p-6 md:p-8 overflow-hidden">
          {/* Left side - Image Preview */}
          <div className="w-full md:w-1/2 flex flex-col">
            <ImagePreview />
            
            {/* Loading Indicators */}
            {isImageLoading && (
              <div className="mt-4">
                <LoadingIndicator />
              </div>
            )}
            {isStreamingImageLoading && (
              <div className="mt-4">
                <SimpleProgressBar progress={percentage} />
              </div>
            )}
          </div>
          
          {/* Right side - Filters */}
          <div className="w-full md:w-1/2">
            <FilterButtons />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-3 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Image Convolution Explorer
          </p>
          <p className="text-sm text-gray-500">
            Created with ♥ using React & Flask
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UploadImage;