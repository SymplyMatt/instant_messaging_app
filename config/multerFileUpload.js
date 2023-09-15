const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    req.fileType = ext;
    if (!ext) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});