import { createContext, useContext, useState } from "react";
import axios from "axios";

export const ImageProcessingContext = createContext();

export const ImageProcessingProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [filter, setFilter] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isStreamingImageLoading, setIsStreamingImageLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const [thresholdValue, setThresholdValue] = useState(128);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  console.log(BASE_URL)
  const base64ToBlob = (base64, contentType = "image/png") => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  // Images that are sent as a blob
  const handleRegularImage = async (selectedFilter) => {
    let formData = new FormData();
    formData.append("image", image);
    if (thresholdValue >= 0 && thresholdValue <= 255) {
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
      setOutputImage({ url: url, blob: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleStreamingImage = async (selectedFilter) => {
    // Create form data with the image
    let formData = new FormData();
    formData.append("image", image);
    setImageLoaded(false)

    try {
      setIsStreamingImageLoading(true);
      // Make a POST request to the streaming endpoint
      const response = await fetch(`${BASE_URL}/${selectedFilter}`, {
        method: "POST",
        body: formData,
      });

      // Create a reader from the response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Process the streaming response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value);

        // Process complete SSE messages
        const messages = buffer.split("\n\n");
        buffer = messages.pop(); // Keep the incomplete message in buffer

        for (const message of messages) {
          if (message.startsWith("data: ")) {
            const data = message.substring(6); // Remove 'data: ' prefix

            if (data === "DONE") {
              setIsStreamingImageLoading(false);
              setPercentage(0);
              setImageLoaded(true);
              setIsImageLoading(false);
            } else {
              const base64 = data
                .replace(/^data:image\/(png|jpeg);base64,/, "")
                .trim();

              const blob = base64ToBlob(base64, "image/png");
              const objectUrl = URL.createObjectURL(blob);
              setOutputImage({
                url: objectUrl,
                blob: blob,
                base64: data,
              });
              setPercentage((prevPercentage) => prevPercentage + 20);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error with streaming image processing:", error);
      setIsImageLoading(false);
    }
  };

  const downloadImage = () => {
    downloadRegularImage(outputImage);
  };

  const downloadRegularImage = (imageData, filename = "processed.png") => {
    if (!imageData?.blob) {
      console.error("No blob found to download.");
      return;
    }
    const url = URL.createObjectURL(imageData.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up memory
  };

  const handleImageProcessing = async () => {
    if (!image) {
      console.log("No image to be found");
      return;
    }

    if (outputImage) {
      setOutputImage(null);
    }

    const filters = {
      "blur": "gaussian_blur",
      "sharpen": "sharpen_image",
      "invert": "invert_image",
      "black and white": "black_and_white_image",
      "red channel": "red_channel",
      "green channel": "green_channel",
      "blue channel": "blue_channel",
      "laplacian": "laplacian_image",
    };

    const selectedFilter = filters[filter];

    if (
      selectedFilter === "gaussian_blur" ||
      selectedFilter == "sharpen_image" ||
      selectedFilter == "laplacian_image" ||
      selectedFilter == "invert_image"
    ) {
      await handleStreamingImage(selectedFilter);
    } else {
      setIsImageLoading(true);

      await handleRegularImage(selectedFilter);
    }
  };

  const deleteImage = async () => {
    setImage(null);
    setImageLoaded(false);
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
    isStreamingImageLoading,
    percentage,
    downloadImage,
    imageLoaded
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
