// import React, { useState, useRef, useEffect } from "react";
// import { Editor } from "@monaco-editor/react";
// import axios from "axios";
// import * as tf from "@tensorflow/tfjs";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import WebCamCapture from "./WebCamCapture.jsx";

// export default function Coder({ submitTest }) {
//   const [code, setCode] = useState("// Write your code here...");
//   const [output, setOutput] = useState("");
//   const [language, setLanguage] = useState("javascript");
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [detections, setDetections] = useState([]);
//   const [isWebcamLoaded, setIsWebcamLoaded] = useState(false);

//   const handleEditorChange = (value) => {
//     setCode(value);
//   };

//   // Function to send code to the backend and get the output
//   const runCode = async () => {
//     let apiUrl;
//     if (language === "python") {
//       apiUrl = "/run-python";
//     } else if (language === "java") {
//       apiUrl = "/run-java";
//     } else if (language === "javascript") {
//       apiUrl = "/run-javascript";
//     }

//     try {
//       const response = await axios.post(apiUrl, { code });
//       setOutput(response.data);
//     } catch (error) {
//       setOutput(`Error: ${error.message}`);
//     }
//   };

//   function handleSubmit() {
//     submitTest();
//   }

//   // Load Object Detection Model
//   useEffect(() => {
//     const loadModel = async () => {
//       const model = await cocoSsd.load();
//       detectObjects(model);
//     };

//     const detectObjects = async (model) => {
//       if (!webcamRef.current || !isWebcamLoaded) return;

//       const video = webcamRef.current;
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       setInterval(async () => {
//         if (video.readyState !== 4) return; // Ensure video is loaded

//         const predictions = await model.detect(video);
//         setDetections(predictions);

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         predictions.forEach((prediction) => {
//           const [x, y, width, height] = prediction.bbox;

//           ctx.strokeStyle = "red";
//           ctx.lineWidth = 2;
//           ctx.strokeRect(x, y, width, height);
//           ctx.fillStyle = "red";
//           ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);

//           // Log if a phone or multiple people are detected
//           if (prediction.class === "cell phone" || prediction.class === "person") {
//             console.log(`Detected: ${prediction.class}`);
//           }
//         });
//       }, 2000); // Run every 2 seconds
//     };

//     if (isWebcamLoaded) loadModel();
//   }, [isWebcamLoaded]); // Runs only when webcam is loaded

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Left: Code Editor */}
//       <div style={{ width: "50%", padding: "20px" }}>
//         <select onChange={(e) => setLanguage(e.target.value)} value={language}>
//           <option value="javascript">JavaScript</option>
//           <option value="python">Python</option>
//           <option value="java">Java</option>
//         </select>

//         <Editor
//           height="450px"
//           language={language}
//           value={code}
//           onChange={handleEditorChange}
//           theme="vs-dark"
//         />

//         <button onClick={runCode} style={{ marginTop: "20px", padding: "10px" }}>
//           Run Code
//         </button>

//         <div style={{ marginTop: "20px", backgroundColor: "#f0f0f0", padding: "10px" }}>
//           <strong>Output:</strong>
//           <pre>{output}</pre>
//         </div>

//         <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px" }}>
//           Submit Test
//         </button>
//       </div>

//       {/* Right: Webcam & Object Detection */}
//       <div style={{ width: "50%", position: "relative" }}>
//         <div style={{ position: "absolute", top: "20px", right: "20px", width: "250px", height: "150px", border: "2px solid black" }}>
//           <video
//             ref={webcamRef}
//             autoPlay
//             playsInline
//             width="250"
//             height="150"
//             onLoadedMetadata={() => setIsWebcamLoaded(true)}
//             style={{ position: "absolute" }}
//           />
//           <canvas ref={canvasRef} width="250" height="150" style={{ position: "absolute", top: 0, left: 0 }} />
//         </div>

//         {/* Detected Objects List */}
//         <div style={{ marginTop: "180px", padding: "10px", backgroundColor: "#f0f0f0" }}>
//           <strong>Detections:</strong>
//           <ul>
//             {detections.map((det, index) => (
//               <li key={index}>{det.class}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/views/student/Components/Coder.jsx
import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import WebCamCapture from "./WebCamCapture";

export default function Coder({ submitTest }) {
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [isWebcamLoaded, setIsWebcamLoaded] = useState(false);

  const handleEditorChange = (value) => setCode(value);

  const runCode = async () => {
    let apiUrl;
    if (language === "python") apiUrl = "/run-python";
    else if (language === "java") apiUrl = "/run-java";
    else apiUrl = "/run-javascript";

    try {
      const response = await axios.post(apiUrl, { code });
      setOutput(response.data);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSubmit = () => submitTest();

  useEffect(() => {
    const loadModel = async () => {
      const model = await cocoSsd.load();
      detectObjects(model);
    };

    const detectObjects = async (model) => {
      const video = webcamRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      setInterval(async () => {
        if (!video || video.readyState !== 4) return;

        const predictions = await model.detect(video);
        setDetections(predictions);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        predictions.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = "red";
          ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);

          if (prediction.class === "cell phone" || prediction.class === "person") {
            console.log(`Detected: ${prediction.class}`);
          }
        });
      }, 3000);
    };

    if (isWebcamLoaded) loadModel();
  }, [isWebcamLoaded]);

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
  {/* Left: Code Editor */}
  <div style={{ width: "50%", padding: "20px" }}>
    <select onChange={(e) => setLanguage(e.target.value)} value={language}>
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
    </select>

    <Editor
      height="450px"
      language={language}
      value={code}
      onChange={handleEditorChange}
      theme="vs-dark"
    />

    <button onClick={runCode} style={{ marginTop: "20px", padding: "10px" }}>
      Run Code
    </button>

    <div style={{ marginTop: "20px", backgroundColor: "#f0f0f0", padding: "10px" }}>
      <strong>Output:</strong>
      <pre>{output}</pre>
    </div>

    <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px" }}>
      Submit Test
    </button>
  </div>

  {/* Right Half Container (only for layout, does not constrain the video) */}
  <div style={{ width: "50%" }} />

  {/* Absolutely Positioned Webcam Top-Right */}
  <div
    style={{
      position: "absolute",
      top: "20px",
      right: "10px",
      width: "550px",
      height: "100px",
    }}
  >
    <WebCamCapture
      ref={webcamRef}
      onLoadedMetadata={() => setIsWebcamLoaded(true)}
    />
    <canvas
      ref={canvasRef}
      width="450"
      height="450"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  </div>

  {/* Detected Objects List Below Webcam */}
  <div
    style={{
      position: "absolute",
      top: "490px",
      right: "20px",
      width: "450px",
      backgroundColor: "#f0f0f0",
      padding: "10px",
    }}
  >
    <strong>Detections:</strong>
    <ul>
      {detections.map((det, index) => (
        <li key={index}>{det.class}</li>
      ))}
    </ul>
  </div>
</div>

  );
}
