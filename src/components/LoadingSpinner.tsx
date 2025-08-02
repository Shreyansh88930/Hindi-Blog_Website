import React from "react";
import "./Loader.css";


const LoadingSpinner = ({ loadingSpinner }: { loadingSpinner: boolean }) => {
  if (!loadingSpinner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;
