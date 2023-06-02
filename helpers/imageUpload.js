import multer from "multer";
const FILE_TYPE_MAP = {
  // map file types
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg", // map file types
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-.${extension}`); // e.g: filename-123456789.jpg
  },
});

const upload = multer({ storage: storage }); // initialize multer

export default upload; // export the upload function
