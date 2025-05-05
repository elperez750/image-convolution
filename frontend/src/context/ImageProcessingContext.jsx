import { createContext, useContext, useState } from "react";
import axios from "axios";

export const ImageProcessingContext = createContext();

export const ImageProcessingProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [filter, setFilter] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isStreamingImageLoading, setIsStreamingImageLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const [thresholdValue, setThresholdValue] = useState(128);
  const BASE_URL = "http://127.0.0.1:5000";


  const handleRegularImage = async({selectedFilter}) => {
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
  

  const handleStreamingImage = async() => {
    // Create form data with the image
    let formData = new FormData();
    formData.append("image", image);
    
  
    try {

      setIsStreamingImageLoading(true);
      // Make a POST request to the streaming endpoint
      const response = await fetch(`${BASE_URL}/progressive_blur`, {
        method: 'POST',
        body: formData,
      });
  
      // Create a reader from the response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
  
      // Process the streaming response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk and add to buffer
        buffer += decoder.decode(value);
        
        // Process complete SSE messages
        const messages = buffer.split('\n\n');
        buffer = messages.pop(); // Keep the incomplete message in buffer

        for (const message of messages) {
          if (message.startsWith('data: ')) {
            const data = message.substring(6); // Remove 'data: ' prefix
            
            if (data === 'DONE') {
              setIsStreamingImageLoading(false)
              setPercentage(0);
              setIsImageLoading(false);
            } else {
              setOutputImage(data);
              setPercentage((prevPercentage) => prevPercentage + 20)

            }
          }
        }
      }
    } catch (error) {
      console.error("Error with streaming image processing:", error);
      setIsImageLoading(false);
    }
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
      "black and white": "black_and_white_image",
      "red channel": "red_channel",
      "green channel": "green_channel",
      "blue channel": "blue_channel",
      "laplacian": "laplacian_image"
    };

    const selectedFilter = filters[filter];


    if (selectedFilter === "gaussian_blur") {
      await handleStreamingImage(selectedFilter)
      
    }
    else {
      setIsImageLoading(true);

      await handleRegularImage(selectedFilter)
    }
  }

  
   


  

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
    isStreamingImageLoading,
    percentage,
    
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
