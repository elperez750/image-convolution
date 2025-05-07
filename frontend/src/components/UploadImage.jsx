import React from "react";
import ImagePreview from "./ImagePreview";
import FilterButtons from "./FilterButtons";
import { useImageProcessingContext } from "../context/ImageProcessingContext";
import LoadingIndicator from "./LoadingIndicator";
import SimpleProgressBar from "./SimpleProgressBar";

const UploadImage = () => {
  const { isImageLoading, isStreamingImageLoading, percentage } = useImageProcessingContext();

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full h-full max-w-7xl bg-white rounded-lg shadow-md p-10 overflow-auto">
          {/* Image Preview Section */}
          <ImagePreview />

          {/* Filter Buttons and upload button */}
          <FilterButtons />

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
      </div>
    </div>
  );
};

export default UploadImage;
