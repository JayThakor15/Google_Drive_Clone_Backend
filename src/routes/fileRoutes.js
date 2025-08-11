import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { uploadFile } from '../controller/fileController.js';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);

export default router;