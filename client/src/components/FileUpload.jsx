import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDownloadLink(response.data.downloadURL);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed.");
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>

      {downloadLink && (
        <div>
          <p>Download your file: </p>
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            {downloadLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
