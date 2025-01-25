const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

let links = [];

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "./client/dist")));

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
} else {
  // Read all files in the uploads directory and populate links array
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads directory:", err);
    } else {
      links = files.map((file) => file); // Add all filenames to links array
      console.log("Existing files loaded:", links);
    }
  });
}

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Generate download link with filename parameter
  const downloadURL = `${req.file.filename}`;

  links.push(downloadURL);
  res.json({
    message: "File uploaded successfully",
    downloadURL: links,
  });
});

// Get all uploaded files
app.get("/files", (req, res) => {
  res.json({
    message: "Files fetched successfully",
    downloadURL: links,
  });
});

// Download and delete route
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send("Error downloading file");
      } else {
        // Delete the file after successful download
        // fs.unlink(filePath, (err) => {
        //   if (err) {
        //     console.error("Error deleting file:", err);
        //   } else {
        //     console.log(`File ${filename} deleted successfully`);
        //     links = links.filter((file) => file !== filename);
        //   }
        // });
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

// Delete file route
app.delete("/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ message: "Error deleting file" });
      } else {
        // Remove the deleted file from the links array
        links = links.filter((file) => file !== filename);
        console.log(`File ${filename} deleted successfully`);
        res.json({ message: "File deleted successfully", downloadURL: links });
      }
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
