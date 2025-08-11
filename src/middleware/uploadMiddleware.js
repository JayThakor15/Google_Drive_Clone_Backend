import multer from 'multer';

const storage = multer.memoryStorage(); // For uploading to cloud storage
const upload = multer({ storage });

export default upload;