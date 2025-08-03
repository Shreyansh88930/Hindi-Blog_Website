import React from "react";
import "./Loader.css";

const LoadingSpinner = ({ loadingSpinner }: { loadingSpinner: boolean }) => {
  if (!loadingSpinner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 loader" />
    </div>
  );
};

export default LoadingSpinner;
