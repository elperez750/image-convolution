import React from "react";

const SimpleProgressBar = ({ progress = 0 }) => {
  // Ensure progress is between 0 and 100
  const validProgress = Math.min(Math.max(0, progress), 100);

  return (
    <div className="w-full mb-4 mt-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${validProgress}%` }}
        ></div>
      </div>
      <div className="text-center text-sm font-medium">
        {Math.round(validProgress)}%
      </div>
    </div>
  );
};

export default SimpleProgressBar;