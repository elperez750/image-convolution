import React from "react";
import ImagePreview from "./ImagePreview";
import FilterButtons from "./FilterButtons";

const UploadImage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-10">
        {/* Image Preview Section */}
        <ImagePreview />

        {/* Filter Buttons and upload button */}
        <FilterButtons />
      </div>
    </div>
  );
};

export default UploadImage;
