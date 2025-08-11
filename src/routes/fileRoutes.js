import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { uploadFile, renameFile, deleteFile,createFolder,renameFolder,deleteFolder,getTrashedFiles,getTrashedFolders } from '../controller/fileController.js';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.put('/files/:id/rename', authenticateToken, renameFile);
router.delete('/files/:id', authenticateToken, deleteFile);
router.post("/folders", authenticateToken, createFolder);
router.put("/folders/:id/rename", authenticateToken, renameFolder);
router.delete("/folders/:id", authenticateToken, deleteFolder);
router.get('/files/trash', authenticateToken, getTrashedFiles);
router.get('/folders/trash', authenticateToken, getTrashedFolders);

export default router;