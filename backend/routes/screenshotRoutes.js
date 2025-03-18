// // // routes/screenshotRoutes.js
// // import express from 'express';
// // import multer from 'multer';
// // import fs from 'fs';
// // import path from 'path';

// // const router = express.Router();

// // // Configure multer for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'uploads/'); // Ensure this folder exists
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${Date.now()}-${file.originalname}`); // Save with timestamp to avoid conflicts
// //   },
// // });

// // const upload = multer({ storage });

// // // Endpoint to save the screenshot
// // router.post('/api/save-screenshot', upload.single('screenshot'), (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: 'No file uploaded.' });
// //     }
// //     // File is saved to the uploads folder, respond with success
// //     res.status(200).json({ message: 'Screenshot saved successfully!', filename: req.file.filename });
// //   } catch (error) {
// //     console.error('Error saving screenshot:', error);
// //     res.status(500).json({ message: 'Failed to save screenshot.' });
// //   }
// // });

// // // Endpoint to get the list of screenshots
// // router.get('/api/screenshot-logs', (req, res) => {
// //   fs.readdir('uploads', (err, files) => {
// //     if (err) {
// //       return res.status(500).json({ message: 'Failed to retrieve screenshots.' });
// //     }
// //     res.status(200).json(files);
// //   });
// // });

// // export default router;

// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import mongoose from 'mongoose';
// import CheatingLog from '../models/cheatingLogModel.js'; // Ensure the path is correct

// const router = express.Router(); 

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Ensure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Save with timestamp to avoid conflicts
//   },
// });

// const upload = multer({ storage });

// // Endpoint to save the screenshot
// router.post('/api/save-screenshot', upload.single('screenshot'), async (req, res) => {
//   try {
//     const { username, email, examId } = req.body; // Get necessary fields from request body

//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     // Validate that required fields are present
//     if (!username || !email || !examId) {
//       return res.status(400).json({ message: 'Missing required fields: username, email, or examId.' });
//     }

//     // Find existing cheating log or create a new one
//     let log = await CheatingLog.findOne({ examId, username, email });
//     if (!log) {
//       log = new CheatingLog({ username, email, examId, screenshots: [] });
//     }

//     // Append the new screenshot to the array
//     log.screenshots.push(req.file.filename);

//     await log.save(); // Save to the database

//     // Respond with success
//     res.status(200).json({ message: 'Screenshot and cheating log saved successfully!', filename: req.file.filename });
//   } catch (error) {
//     console.error('Error saving screenshot:', error);
//     res.status(500).json({ message: 'Failed to save screenshot.', error: error.message });
//   }
// });

// // Endpoint to get the list of screenshots
// router.get('/api/screenshot-logs', async (req, res) => {
//   try {
//     const logs = await CheatingLog.find(); // Fetch all logs from the database
//     res.status(200).json(logs); // Send logs as response
//   } catch (error) {
//     console.error('Failed to retrieve logs:', error);
//     res.status(500).json({ message: 'Failed to retrieve screenshots.' });
//   }
// });

// export default router;
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import CheatingLog from '../models/cheatingLogModel.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save with timestamp to avoid conflicts
  },
});

const upload = multer({ storage });

// Endpoint to save the screenshot
router.post('/api/save-screenshot', upload.single('screenshot'), async (req, res) => {
  try {
    const { username, email, examId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (!username || !email || !examId) {
      return res.status(400).json({ message: 'Missing required fields: username, email, or examId.' });
    }

    // 🔥 Ensure log is created or retrieved properly
    let log = await CheatingLog.findOne({ examId, username, email });

    if (!log) {
      log = new CheatingLog({
        username,
        email,
        examId,
        screenshots: [] // Ensure screenshots array is initialized
      });
    }

    // ✅ Ensure screenshots array exists before pushing
    if (!Array.isArray(log.screenshots)) {
      log.screenshots = [];
    }

    // Push the new screenshot filename into the array
    log.screenshots.push(req.file.filename);

    // Save the updated log to the database
    await log.save();

    res.status(200).json({ message: 'Screenshot saved successfully!', filename: req.file.filename });
  } catch (error) {
    console.error('Error saving screenshot:', error);
    res.status(500).json({ message: 'Failed to save screenshot.', error: error.message });
  }
});

// Endpoint to get the list of screenshots
router.get('/api/screenshot-logs', async (req, res) => {
  try {
    const logs = await CheatingLog.find(); // Fetch all logs from the database
    res.status(200).json(logs);
  } catch (error) {
    console.error('Failed to retrieve logs:', error);
    res.status(500).json({ message: 'Failed to retrieve screenshots.' });
  }
});

export default router;

