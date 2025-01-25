import React, { useEffect, useState } from "react";
import axios from "axios";
import Dnd from "./Dnd";

import { MdDelete } from "react-icons/md";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderx, setLoaderx] = useState(false)

  const handleUpload = async () => {
    setLoader(true)
    if (!file) {
      setLoader(false)

      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:3000/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setDownloadLinks(response.data.downloadURL);
      setFile(null);
      setLoader(false)
    } catch (error) {
      console.error("Upload error:", error);
      setLoader(false);
    }
  };
  const getFiles = async () => {
    setLoaderx(true)
    try {
      const response = await axios.get(`http://localhost:3000/files`);

      setDownloadLinks(response.data.downloadURL);
      setLoaderx(false)
    } catch (error) {
      setLoaderx(false)
      console.error("Files fetch error", error);
    }
  };
  const deleteFile = async (filename) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete/${filename}`
      );

      setDownloadLinks(response.data.downloadURL);
    } catch (error) {
      console.error("Files fetch error", error);
    }
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full p-4 relative">
      {loaderx && (
            <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex justify-center items-center backdrop-blur-sm">
              <img className="w-24 h-24" src="/loader.svg" alt="" />
            </div>
          )}
      
      <div className="flex flex-col justify-between items-center gap-4 w-full">
        <div className="w-full max-w-[600px] relative">
          {loader && (
            <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex justify-center items-center backdrop-blur-sm">
              <img className="w-24 h-24" src="/loader.svg" alt="" />
            </div>
          )}
          {downloadLinks.length>4 && (
            <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex justify-center items-center backdrop-blur-sm">
              <p className="text-white font-bold text-base text-center">Maximum 5 files allowed<br></br>Delete one or more files to upload more</p>
            </div>
          )}
          <Dnd file={file} setFile={setFile} />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-[600px]">
          {downloadLinks.map((file) => (
            <div className="w-full border border-green-400 rounded-md flex items-center justify-between">
              <a href={`https://greenflag.onrender.com/download/${file}`} target="_blank" rel="noopener noreferrer">
                <p className="truncate break-words text-sm text-gray-500 font-medium px-2 hover:text-green-600">
                  {file}
                </p>
              </a>

              <div
                onClick={() => {
                  deleteFile(file);
                }}
                className="w-10 h-8 min-w-10 bg-red-400 hover:bg-red-600 flex items-center justify-center rounded-r-[5px]"
              >
                <MdDelete color="white" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
