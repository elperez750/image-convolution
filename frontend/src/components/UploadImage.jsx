import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState(null);
  const effects = ["blur", "sharpen", "contrast", "sepia", "invert"];
  const [outputImage, setOutputImage] = useState(null);
  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSharpenUpload = async (e) => {
    if (!image) {
      console.log("No image selected");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "http://127.0.0.1:5000/sharpen_image",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log(response.data)
      const url =  URL.createObjectURL(response.data);

      setOutputImage(url)
      // Handle success - could reset the form or show a success message
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error - show error message to user
    }
  };

  const handleGaussianUpload = async (e) => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    try {
      // Create FormData correctly
      let formData = new FormData();
      formData.append("image", image);

      console.log(formData);
      const response = await axios.post(
        "http://127.0.0.1:5000/gaussian_blur",
        formData,
        {
          responseType:"blob"
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(URL.createObjectURL(response.data))
      console.log("Upload successful:", response.data);
      // Handle success - could reset the form or show a success message
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error - show error message to user
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-10">
        {/* Header */}
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
              onClick={() => setImage(null)}
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

        {/* Upload Button */}
        {image ? (
          <>
            <div className="grid grid-flow-row grid-cols-2 mb-6 gap-2">
              {effects.map((effect) => (
                <button
                  key={effect}
                  onClick={() => setFilter(effect)}
                  className="cursor-pointer flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition w-full text-center"
                >
                  {effect[0].toLocaleUpperCase() + effect.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  switch (filter) {
                    case "blur":
                      handleGaussianUpload();
                      break;
                    case "sharpen":
                      handleSharpenUpload();
                      break;
                    default:
                      // Default handler or fallback
                      console.log("No handler for filter:", filter);
                  }
                }}
                className="cursor-pointer flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition w-full text-center"
              >
                Apply Filter
              </button>
            </div>

            {outputImage && <img src={outputImage} />}
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
    </div>
  );
};

export default UploadImage;
