// import asyncHandler from "express-async-handler";
// import CheatingLog from "../models/cheatingLogModel.js";

// // @desc Save cheating log data
// // @route POST /api/cheatingLogs
// // @access Private
// const saveCheatingLog = asyncHandler(async (req, res) => {
//   const {
//     noFaceCount,
//     multipleFaceCount,
//     cellPhoneCount,
//     prohibitedObjectCount,
//     examId,
//     username,
//     email,
//   } = req.body;

//   const cheatingLog = new CheatingLog({
//     noFaceCount,
//     multipleFaceCount,
//     cellPhoneCount,
//     prohibitedObjectCount,
//     examId,
//     username,
//     email,
//   });

//   const savedLog = await cheatingLog.save();

//   if (savedLog) {
//     res.status(201).json(savedLog);
//   } else {
//     res.status(400);
//     throw new Error("Invalid Cheating Log Data");
//   }
// });

// // @desc Get all cheating log data for a specific exam
// // @route GET /api/cheatingLogs/:examId
// // @access Private
// const getCheatingLogsByExamId = asyncHandler(async (req, res) => {
//   const examId = req.params.examId;
//   const cheatingLogs = await CheatingLog.find({ examId });

//   res.status(200).json(cheatingLogs);
// });

// export { saveCheatingLog, getCheatingLogsByExamId };



// --------------------------------------------------------------------------------------------------------------------------------------


//<<<<<<<<<< 21 MARCH >>>>>>>>>>>
// import asyncHandler from "express-async-handler";
// import fs from "fs"; // Import fs for file system operations
// import CheatingLog from "../models/cheatingLogModel.js";

// // @desc Save cheating log data with screenshot
// // @route POST /api/cheatingLogs
// // @access Private
// const saveCheatingLog = asyncHandler(async (req, res) => {
//   const {
//     noFaceCount,
//     multipleFaceCount,
//     cellPhoneCount,
//     prohibitedObjectCount,
//     examId,
//     username,
//     email,
//     screenshot // Base64 image string
//   } = req.body;

//   let filePath = '';

//   // Save screenshot if provided
//   if (screenshot) {
//     try {
//       // Decode the base64 image and save it as a screenshot
//       const base64Image = screenshot.split(';base64,').pop();
//       const buffer = Buffer.from(base64Image, 'base64');

//       // Save the screenshot to a file
//       const timestamp = Date.now();
//       const fileName = `screenshot_${timestamp}.png`;
//       filePath = `uploads/${fileName}`; // Ensure this folder exists

//       await fs.promises.writeFile(filePath, buffer); // Use promises for better error handling
//     } catch (err) {
//       console.error("Error saving screenshot: ", err);
//       res.status(500).json({ message: 'Error saving screenshot.' });
//       return;
//     }
//   }

//   // Now save the cheating log entry
//   const cheatingLog = new CheatingLog({
//     noFaceCount,
//     multipleFaceCount,
//     cellPhoneCount,
//     prohibitedObjectCount,
//     examId,
//     username,
//     email,
//     screenshot: filePath // Save the path of the saved screenshot
//   });

//   const savedLog = await cheatingLog.save();

//   if (savedLog) {
//     res.status(201).json(savedLog);
//   } else {
//     res.status(400);
//     throw new Error("Invalid Cheating Log Data");
//   }
// });

// // @desc Get all cheating log data for a specific exam
// // @route GET /api/cheatingLogs/:examId
// // @access Private
// const getCheatingLogsByExamId = asyncHandler(async (req, res) => {
//   const examId = req.params.examId;
//   const cheatingLogs = await CheatingLog.find({ examId });

//   res.status(200).json(cheatingLogs);
// });

// export { saveCheatingLog, getCheatingLogsByExamId };

import asyncHandler from "express-async-handler";
import fs from "fs"; // Import fs for file system operations
import CheatingLog from "../models/cheatingLogModel.js";


const saveCheatingLog = asyncHandler(async (req, res) => {
  const {
    noFaceCount,
    multipleFaceCount,
    cellPhoneCount,
    prohibitedObjectCount,
    examId,
    username,
    email,
    screenshot,
  } = req.body;

  // Find the existing log or create a new one
  let log = await CheatingLog.findOne({ examId, username, email });

  if (!log) {
    log = new CheatingLog({
      noFaceCount: 0,
      multipleFaceCount: 0,
      cellPhoneCount: 0,
      prohibitedObjectCount: 0,
      examId,
      username,
      email,
      screenshots: [],
    });
  }

  // Increment counts based on the detected violation
  if (noFaceCount) log.noFaceCount += noFaceCount;
  if (multipleFaceCount) log.multipleFaceCount += multipleFaceCount;
  if (cellPhoneCount) log.cellPhoneCount += cellPhoneCount;
  if (prohibitedObjectCount) log.prohibitedObjectCount += prohibitedObjectCount;

  // Add screenshot if provided
  if (screenshot) {
    log.screenshots.push(screenshot);
  }

  // Save the updated log
  const savedLog = await log.save();

  if (savedLog) {
    res.status(201).json(savedLog);
  } else {
    res.status(400);
    throw new Error("Invalid Cheating Log Data");
  }
});

const getCheatingLogsByExamId = asyncHandler(async (req, res) => {
  const examId = req.params.examId;
  const cheatingLogs = await CheatingLog.find({ examId });

  if (cheatingLogs) {
    res.status(200).json(cheatingLogs);
  } else {
    res.status(404);
    throw new Error("No cheating logs found for this exam.");
  }
});


export { saveCheatingLog, getCheatingLogsByExamId };
