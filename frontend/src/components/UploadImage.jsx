import React from "react";
import ImagePreview from "./ImagePreview";
import FilterButtons from "./FilterButtons";
import { useImageProcessingContext } from "../context/ImageProcessingContext";
import LoadingIndicator from "./LoadingIndicator";
const UploadImage = () => {
  const { isImageLoading } = useImageProcessingContext();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-10">
        {/* Image Preview Section */}
        <ImagePreview />

        {/* Filter Buttons and upload button */}
        <FilterButtons />
        {isImageLoading && (
          <div>
            <LoadingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;
