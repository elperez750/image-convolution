import React from "react";

const LoadingIndicator = () => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md p-4"
      style={{ height: "300px", width: "400px" }}
    >
      {/* Simple spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-sm">Loading image...</p>
    </div>
  );
};

export default LoadingIndicator;
