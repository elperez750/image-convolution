import { createContext, useContext, useState } from "react";
import axios from "axios";

export const ImageProcessingContext = createContext();

export const ImageProcessingProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [filter, setFilter] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [thresholdValue, setThresholdValue] = useState(128);

  const handleImageProcessing = async () => {
    const BASE_URL = "http://127.0.0.1:5000";
    if (!image) {
      console.log("No image to be found");
      return;
    }

    if (outputImage) {
      setOutputImage(null);
    }

    setIsImageLoading(true);

    const filters = {
      "blur": "gaussian_blur",
      "sharpen": "sharpen_image",
      "black and white": "black_and_white_image",
      "red channel": "red_channel",
      "green channel": "green_channel",
      "blue channel": "blue_channel",
      "laplacian": "laplacian_image"
    };

    const selectedFilter = filters[filter];

    setIsImageLoading(true);
    let formData = new FormData();
    formData.append("image", image);
    if ((thresholdValue >= 0 && thresholdValue <= 255)) {
      formData.append("threshold_value", thresholdValue);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/${selectedFilter}`,
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const url = URL.createObjectURL(response.data);
      setOutputImage(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const deleteImage = async () => {
    setImage(null);
    setOutputImage(null);
  };

  const contextValues = {
    image,
    filter,
    outputImage,
    isImageLoading,
    thresholdValue,
    setImage,
    setOutputImage,
    setFilter,
    setIsImageLoading,
    setThresholdValue,
    handleImageProcessing,
    deleteImage,
    
  };

  return (
    <ImageProcessingContext.Provider value={contextValues}>
      {children}
    </ImageProcessingContext.Provider>
  );
};

export const useImageProcessingContext = () => {
  const context = useContext(ImageProcessingContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
