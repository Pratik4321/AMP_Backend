import multer from "multer";
import path from "path";
import fs from "fs";

// Create the 'uploads' folder in the root directory if it doesn't exist
const uploadDirectory = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure Multer to store the uploaded file in the 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Save to the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
