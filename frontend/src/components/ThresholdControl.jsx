import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { useImageProcessingContext } from "../context/ImageProcessingContext";

const ThresholdControl = () => {
  const {thresholdValue, setThresholdValue} = useImageProcessingContext()

  return (
    <div>
      <h2>Select Threshold</h2>

      <Slider
        className="w-full"
        value={thresholdValue}
        onChange={(e, newValue) => setThresholdValue(newValue)}
        aria-label="Default"
        valueLabelDisplay="auto"
        min={0}
        max={255}
      />
    </div>
  );
};

export default ThresholdControl;
