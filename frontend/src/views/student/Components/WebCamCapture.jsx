// // src/components/WebCamCapture.jsx
// import React, { useRef, useEffect, useState } from 'react';

// const WebCamCapture = ({ onCapture, onObjectDetected }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [hasDetectedObject, setHasDetectedObject] = useState(false); // Track if an object was detected

//   useEffect(() => {
//     // Start webcam feed
//     const startWebCam = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//     };

//     startWebCam();

//     // Cleanup on component unmount
//     return () => {
//       const stream = videoRef.current.srcObject;
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const captureScreenshot = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     const imageSrc = canvas.toDataURL('image/png');
//     onCapture(imageSrc); // Send captured image to parent
//   };

//   const detectObjects = () => {
//     // Simulate object detection logic
//     const isMobileDetected = Math.random() < 0.1; // Simulate a 10% chance of detection

//     if (isMobileDetected && !hasDetectedObject) {
//       // Only trigger if an object is detected and it hasn't been detected before
//       setHasDetectedObject(true); // Update state to indicate detection
//       onObjectDetected(); // Notify parent of detection
//       captureScreenshot(); // Automatically capture the screenshot
//     } else if (!isMobileDetected) {
//       setHasDetectedObject(false); // Reset state if no object is detected
//     }
//   };

//   useEffect(() => {
//     const detectionInterval = setInterval(detectObjects, 3000); // Check for objects every 3 seconds

//     return () => clearInterval(detectionInterval); // Cleanup
//   }, []);

//   return (
//     <div>
//       <video ref={videoRef} autoPlay style={{ width: '100%' }} />
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// };

// export default WebCamCapture;

/*

// src/components/WebCamCapture.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import * as cocoSsd from '@tensorflow-models/coco-ssd'; // Import COCO-SSD
// import '@tensorflow/tfjs'; // Import TensorFlow.js

// const WebCamCapture = ({ onCapture, onObjectDetected }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [hasDetectedObject, setHasDetectedObject] = useState(false); // Track if an object was detected
//   const [model, setModel] = useState(null); // Track COCO-SSD model

//   useEffect(() => {
//     // Load the COCO-SSD model when the component mounts
//     const loadModel = async () => {
//       const loadedModel = await cocoSsd.load();
//       setModel(loadedModel); // Save the model in state
//     };

//     // Start webcam feed
//     const startWebCam = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//     };

//     loadModel(); // Load model
//     startWebCam(); // Start webcam

//     // Cleanup on component unmount
//     return () => {
//       const stream = videoRef.current?.srcObject;
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const captureScreenshot = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     const imageSrc = canvas.toDataURL('image/png');
//     onCapture(imageSrc); // Send captured image to parent
//   };

//   const detectObjects = async () => {
//     if (model && videoRef.current) {
//       const predictions = await model.detect(videoRef.current);

//       let mobileDetected = false;
//       let multipleFacesDetected = 0;

//       predictions.forEach(prediction => {
//         if (prediction.class === 'cell phone') {
//           mobileDetected = true;
//         }
//         if (prediction.class === 'person') {
//           multipleFacesDetected += 1;
//         }
//       });

//       // Trigger events based on detection
//       if (mobileDetected && !hasDetectedObject) {
//         setHasDetectedObject(true); // Update state to indicate detection
//         alert('Mobile detected!'); // Send alert
//         onObjectDetected(); // Notify parent of detection
//         captureScreenshot(); // Automatically capture the screenshot
//       } else if (multipleFacesDetected > 1 && !hasDetectedObject) {
//         setHasDetectedObject(true); // Update state to indicate detection
//         alert('Multiple faces detected!'); // Send alert
//         onObjectDetected(); // Notify parent of detection
//         captureScreenshot(); // Automatically capture the screenshot
//       } else if (predictions.length === 0) {
//         setHasDetectedObject(false); // Reset detection flag if nothing detected
//       }
//     }
//   };

//   useEffect(() => {
//     // Set a detection interval if model is loaded
//     if (model) {
//       const detectionInterval = setInterval(detectObjects, 3000); // Check for objects every 3 seconds
//       return () => clearInterval(detectionInterval); // Cleanup on unmount
//     }
//   }, [model]); // Re-run if model changes

//   return (
//     <div>
//       <video ref={videoRef} autoPlay style={{ width: '100%' }} />
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// };

// export default WebCamCapture;

*/

import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { Snackbar, Alert } from '@mui/material';

const WebCamCapture = ({ onCapture, onObjectDetected, examId, email, username }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [notification, setNotification] = useState({ message: '', open: false });

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading COCO-SSD model...");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log("COCO-SSD model loaded successfully!");
      } catch (error) {
        console.error("Error loading COCO-SSD model:", error);
      }
    };

    const startWebCam = async () => {
      try {
        console.log("Accessing webcam...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          console.log("Webcam stream started");
        };
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    loadModel();
    startWebCam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureScreenshot = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
    // Convert canvas to PNG or JPEG
    const imageSrc = canvas.toDataURL('image/jpeg'); // Use 'image/png' for PNG
    onCapture(imageSrc);
  
    const file = dataURLtoFile(imageSrc, `screenshot_${Date.now()}.jpeg`);
  
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('examId', examId);

    fetch('/api/save-screenshot', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => console.log('Screenshot saved successfully:', data))
      .catch(error => console.error('Error saving screenshot:', error));
  };

  // Function to convert dataURL to File
  const dataURLtoFile = (dataUrl, fileName) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  const showNotification = (message) => {
    setNotification({ message, open: true });
  };

  const detectObjects = async () => {
    if (!model || !videoRef.current) return;

    try {
      const predictions = await model.detect(videoRef.current);

      console.log("Predictions:", predictions);

      let mobileDetected = false;
      let facesDetected = 0;

      predictions.forEach((prediction) => {
        console.log(`Detected object: ${prediction.class}`);

        if (prediction.class === "cell phone") {
          mobileDetected = true;
        } else if (prediction.class === "person") {
          facesDetected += 1;
        }
      });

      if (mobileDetected) {
        console.log("📱 Mobile phone detected!");
        onObjectDetected("Mobile detected!");
        showNotification("📱 Mobile phone detected!");
        captureScreenshot();
      }

      if (facesDetected > 1) {
        console.log("👥 Multiple faces detected!");
        onObjectDetected("Multiple faces detected!");
        showNotification("👥 Multiple faces detected!");
        captureScreenshot();
      }

      if (facesDetected === 0) {
        console.log("🚫 No face detected!");
        onObjectDetected("No face detected!");
        showNotification("🚫 No face detected!");
        captureScreenshot();
      }
    } catch (error) {
      console.error("Error detecting objects:", error);
    }

    // Re-run the detection every 3 seconds (adjust interval if needed)
    setTimeout(detectObjects, 3000);
  };

  useEffect(() => {
    if (model) {
      console.log("Starting detection loop...");
      detectObjects(); // Start the loop immediately after model loads
    }
  }, [model]);

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '50%', height:'30%'}} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Snackbar for popup message */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000} // Close after 3 seconds
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity="warning" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WebCamCapture;





