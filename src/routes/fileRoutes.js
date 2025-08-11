import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { uploadFile, renameFile, deleteFile,createFolder,renameFolder,deleteFolder,getTrashedFiles,getTrashedFolders, shareFile, accessSharedFile, setFilePermission } from '../controller/fileController.js';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.put('/:id/rename', authenticateToken, renameFile);
router.delete('/:id', authenticateToken, deleteFile);
router.post("/folders", authenticateToken, createFolder);
router.put("/folders/:id/rename", authenticateToken, renameFolder);
router.delete("/folders/:id", authenticateToken, deleteFolder);
router.get('/files/trash', authenticateToken, getTrashedFiles);
router.get('/folders/trash', authenticateToken, getTrashedFolders);
// Share a file (generate shareable link)
router.post('/files/:id/share', authenticateToken, shareFile);

// Access a shared file via token
router.get('/files/share/:token', accessSharedFile);

// Set file permission for a user
router.post('/files/:id/permission', authenticateToken, setFilePermission);

export default router;