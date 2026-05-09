import React from "react";
import "./AdSlot.css";

const AdSlot = ({ variant = "top", label = "Ruang Iklan", className = "" }) => {
  const classes = `ad-slot ad-slot--${variant} ${className}`.trim();

  return (
    <div className={classes} role="complementary" aria-label={label}>
      {label}
    </div>
  );
};

export default AdSlot;
