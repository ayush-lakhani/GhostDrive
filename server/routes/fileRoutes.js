const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Use safeName (UUID) as filename on disk
        // We will generate UUID in the controller for the DB record, 
        // but Multer needs a filename right here.
        // Let's generate a unique name here.
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 20 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        // Allowed file types
        const filetypes = /jpeg|jpg|png|gif|pdf|zip/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Only Images, PDFs and ZIPs are allowed!'));
        }
    }
});

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { duration } = req.body; // Duration in minutes
        
        if (!duration) {
             // Clean up uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Duration is required' });
        }

        const safeName = req.file.filename.split('.')[0]; // UUID part without extension? Or just use the whole filename as safeName identifier?
        // User request says: "safeName: A random UUID". 
        // We used uuidv4() for filename. let's store that.
        
        // Calculate expiry
        const expiryDate = new Date(Date.now() + duration * 60000);

        const fileData = new File({
            originalName: req.file.originalname,
            safeName: req.file.filename, // We use the filename on disk as the safe identifier
            path: req.file.path,
            size: req.file.size,
            expiryDate: expiryDate
        });

        await fileData.save();

        res.json({
            message: 'File uploaded successfully',
            file: {
                originalName: fileData.originalName,
                safeName: fileData.safeName,
                expiryDate: fileData.expiryDate,
                downloadLink: `/api/download/${fileData.safeName}` // Helper for frontend
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during upload' });
    }
});

// GET /api/download/:safeName
router.get('/download/:safeName', async (req, res) => {
    try {
        const file = await File.findOne({ safeName: req.params.safeName });

        if (!file) {
            return res.status(404).json({ error: 'File not found or has been expired' });
        }

        // Check expiry just in case cron hasn't run yet
        if (file.expiryDate < Date.now()) {
            return res.status(410).json({ error: 'This file has been expired and deleted.' });
        }

        const filePath = path.join(__dirname, '../uploads', file.safeName);

        if (fs.existsSync(filePath)) {
            // Burn on Read Logic
            if (file.burnOnRead) {
                // Remove from DB first to prevent race conditions
                await File.deleteOne({ _id: file._id });
                
                res.download(filePath, file.originalName, (err) => {
                    if (!err) {
                        try {
                            // Delete physical file after successful download
                            fs.unlinkSync(filePath);
                            console.log(`🔥 Burned file: ${file.safeName}`);
                        } catch (e) {
                            console.error('Error deleting burned file:', e);
                        }
                    }
                });
            } else {
                res.download(filePath, file.originalName);
            }
        } else {
            res.status(404).json({ error: 'File not found on server' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/meta/:safeName - Check file status without download
router.get('/meta/:safeName', async (req, res) => {
    try {
        const file = await File.findOne({ safeName: req.params.safeName });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        if (file.expiryDate < Date.now()) {
            return res.status(410).json({ error: 'Expired' });
        }

        res.json({
            originalName: file.originalName,
            size: file.size,
            expiryDate: file.expiryDate,
            hasPassword: !!file.password,
            burnOnRead: file.burnOnRead
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
