import React, { useState } from "react";
import ThresholdControl from "./ThresholdControl";
import LoadingIndicator from "./LoadingIndicator";
import { useImageProcessingContext } from "../context/ImageProcessingContext";
const effects = [
  "blur",
  "sharpen",
  "contrast",
  "sepia",
  "invert",
  "black and white",
  "red channel",
  "green channel",
  "blue channel",
  "laplacian"
];

const FilterButtons = () => {
  const {
    outputImage,
    filter,
    setFilter,
    image,
    isImageLoading,
    setImage,
    handleImageProcessing
  } = useImageProcessingContext();

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div>
      {image ? (
        <>
          <div className="grid grid-flow-row grid-cols-2 mb-6 gap-2">
            {effects.map((effect) => (
              <button
                key={effect}
                onClick={() => setFilter(effect)}
                className={`cursor-pointer flex items-center justify-center py-2 px-4 font-medium rounded shadow transition w-full text-center ${
                  filter === effect
                    ? "bg-blue-800 text-white ring-2 ring-blue-500 ring-offset-2"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {effect[0].toLocaleUpperCase() + effect.slice(1)}
              </button>
            ))}
          </div>

          {filter === "black and white" && <ThresholdControl />}
          <div className="flex justify-center">
            <button
              onClick={handleImageProcessing}
              className="cursor-pointer flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition w-full text-center"
            >
              Apply Filter
            </button>
          </div>
          {isImageLoading && <LoadingIndicator />}
          {outputImage && <img className="mt-6" src={outputImage} />}
        </>
      ) : (
        <label
          htmlFor="select-image"
          className="cursor-pointer flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition w-full text-center"
        >
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
      )}
    </div>
  );
};

export default FilterButtons;
