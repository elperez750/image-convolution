import React from "react";
import { useImageProcessingContext } from "../context/ImageProcessingContext";

const ImagePreview = () => {
    const { image, deleteImage } = useImageProcessingContext()
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Upload Image</h1>
        <p className="text-gray-500 text-sm">Select an image to preview</p>
      </div>

      {/* Image Preview Section */}
      {image ? (
        <div className="mb-6">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              alt="Preview"
              className="object-contain max-w-full max-h-64"
              src={URL.createObjectURL(image)}
            />
          </div>
          <div className="mt-2 text-center text-sm text-gray-500">
            {image.name} ({(image.size / 1024).toFixed(2)} KB)
          </div>

          <button
            onClick={deleteImage}
            className="mt-3 w-full py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center mb-6">
          <svg
            className="h-12 w-12 mb-3 text-gray-400"
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
          <p className="text-gray-700 text-center">No image selected</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
