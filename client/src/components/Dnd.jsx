import React, { useState } from "react";

const Dnd = ({ file, setFile }) => {
  const [dragActive, setDragActive] = useState(false);

  // Function to handle file selection
  const handleFileSelect = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // Function to handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Function to handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
 
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full border-dashed border-2 py-12 rounded-lg p-4 text-center relative ${
          dragActive ? "border-green-500" : "border-green-200"
        }`}
      >
        <div className="text-gray-400">
          <div className="flex justify-center mb-2">
            <img className="w-[32px]" src="/upload.svg" alt="Upload Icon" />
          </div>
          <p className="text-[#292D32] text-base font-medium">
            Choose a file or drag & drop it here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Any file any format any size
          </p>
        </div>

        {/* Button for File Input */}
        <div className="mt-3">
          <label
            htmlFor="fileInput"
            className="inline-block px-4 py-1 bg-green-400  rounded-md text-white text-sm cursor-pointer hover:bg-green-600"
          >
            Browse File
          </label>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Highlight overlay when dragging */}
        {dragActive && (
          <div className="absolute w-full h-full top-0 left-0 bg-green-100 opacity-50 pointer-events-none"></div>
        )}
      </div>

  );
};

export default Dnd;
