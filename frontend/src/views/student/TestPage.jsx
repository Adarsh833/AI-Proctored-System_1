// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Box, Grid, CircularProgress } from '@mui/material';
// import PageContainer from 'src/components/container/PageContainer';
// import BlankCard from 'src/components/shared/BlankCard';
// import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion';
// import NumberOfQuestions from './Components/NumberOfQuestions';
// import WebCamCapture from './Components/WebCamCapture';
// import { useGetExamsQuery, useGetQuestionsQuery } from '../../slices/examApiSlice';
// import { useSaveCheatingLogMutation } from 'src/slices/cheatingLogApiSlice';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';

// const TestPage = () => {
//   const { examId } = useParams();
//   const [selectedExam, setSelectedExam] = useState([]);
//   const [examDurationInSeconds, setExamDurationInSeconds] = useState(0);
//   const { data: userExamdata } = useGetExamsQuery();
//   const { data: questionsData, isLoading } = useGetQuestionsQuery(examId);
//   const [questions, setQuestions] = useState([]);
//   const navigate = useNavigate();

//   const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
//   const { userInfo } = useSelector((state) => state.auth);

//   const [cheatingLog, setCheatingLog] = useState({
//     noFaceCount: 0,
//     multipleFaceCount: 0,
//     cellPhoneCount: 0,
//     prohibitedObjectCount: 0,
//     examId: examId,
//     username: '',
//     email: '',
//     screenshot: '',
//   });

//   useEffect(() => {
//     if (questionsData) {
//       setQuestions(questionsData);
//     }
//   }, [questionsData]);

//   useEffect(() => {
//     if (userExamdata) {
//       const exam = userExamdata.filter((exam) => exam.examId === examId);
//       setSelectedExam(exam);
//       setExamDurationInSeconds(exam[0]?.duration * 60 || 0);
//     }
//   }, [userExamdata, examId]);

//   const handleTestSubmission = async () => {
//     try {
//       const updatedCheatingLog = { ...cheatingLog, username: userInfo.name, email: userInfo.email };
//       await saveCheatingLogMutation(updatedCheatingLog).unwrap();

//       toast.success('User Logs Saved!!');
//       navigate(`/Success`);
//     } catch (error) {
//       console.error('Cheating log save error: ', error);
//     }
//   };

//   const saveUserTestScore = () => {
//     // Increment the score by 1 for each correct answer
//   };

//   const handleScreenshotCapture = (imageSrc) => {
//     setCheatingLog((prevLog) => ({ ...prevLog, screenshot: imageSrc }));
//   };

//   const handleObjectDetected = () => {
//     // Logic to log the detection
//     setCheatingLog((prevLog) => ({
//       ...prevLog,
//       prohibitedObjectCount: prevLog.prohibitedObjectCount + 1,
//     }));

//     // Optionally, display an alert to the user
//     alert("Prohibited object detected! Screenshot captured.");
//   };

//   return (
//     <PageContainer title="TestPage" description="This is TestPage">
//       <Box pt="3rem">
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={7} lg={7}>
//             <BlankCard>
//               <Box
//                 width="100%"
//                 minHeight="400px"
//                 boxShadow={3}
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 {isLoading || !questions.length ? (
//                   <CircularProgress />
//                 ) : (
//                   <MultipleChoiceQuestion
//                     submitTest={handleTestSubmission}
//                     questions={questions}
//                     saveUserTestScore={saveUserTestScore}
//                   />
//                 )}
//               </Box>
//             </BlankCard>
//           </Grid>
//           <Grid item xs={12} md={5} lg={5}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <BlankCard>
//                   <NumberOfQuestions
//                     questionLength={questions.length}
//                     submitTest={handleTestSubmission}
//                     examDurationInSeconds={examDurationInSeconds}
//                   />
//                 </BlankCard>
//               </Grid>
//               <Grid item xs={12}>
//                 <BlankCard>
//                   <WebCamCapture onCapture={handleScreenshotCapture} 
//                     onObjectDetected={handleObjectDetected} // Pass the new handler
//                     />
//                 </BlankCard>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default TestPage;


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, CircularProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion';
import NumberOfQuestions from './Components/NumberOfQuestions';
import WebCamCapture from './Components/WebCamCapture';
import { useGetExamsQuery, useGetQuestionsQuery } from '../../slices/examApiSlice';
import { useSaveCheatingLogMutation } from 'src/slices/cheatingLogApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TestPage = () => {
  const { examId } = useParams();
  const [selectedExam, setSelectedExam] = useState([]);
  const [examDurationInSeconds, setExamDurationInSeconds] = useState(0);
  const { data: userExamdata } = useGetExamsQuery();
  const { data: questionsData, isLoading } = useGetQuestionsQuery(examId);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [cheatingLog, setCheatingLog] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    examId: examId,
    username: '',
    email: '',
    screenshot: '',
  });

  useEffect(() => {
    if (questionsData) {
      setQuestions(questionsData);
    }
  }, [questionsData]);

  useEffect(() => {
    if (userExamdata) {
      const exam = userExamdata.find((exam) => exam.examId === examId);
      if (exam) {
        setSelectedExam(exam);
        setExamDurationInSeconds(exam.duration * 60);
      }
    }
  }, [userExamdata, examId]);

  const handleTestSubmission = async () => {
    try {
      const updatedCheatingLog = { ...cheatingLog, username: userInfo.name, email: userInfo.email, screenshots: cheatingLog.screenshots ? [cheatingLog.screenshot] : [] // Corrected line
    };
      await saveCheatingLogMutation(updatedCheatingLog).unwrap();

      toast.success('User Logs Saved!!');
      navigate(`/Success`);
    } catch (error) {
      console.error('Cheating log save error: ', error);
      toast.error('Error saving logs.');
    }
  };

  const saveUserTestScore = () => {
    // Increment the score by 1 for each correct answer
  };

  const handleScreenshotCapture = (imageSrc) => {
    setCheatingLog((prevLog) => ({
      ...prevLog,
      screenshot: [...prevLog.screenshot, imageSrc], // Add each new screenshot
    }));
  };
  

  const handleObjectDetected = (objectType) => {
    if (objectType === 'cell phone') {
      setCheatingLog((prevLog) => ({
        ...prevLog,
        cellPhoneCount: prevLog.cellPhoneCount + 1,
      }));
      toast.warn("Cell phone detected! Screenshot captured.");
    } else if (objectType === 'multiple faces') {
      setCheatingLog((prevLog) => ({
        ...prevLog,
        multipleFaceCount: prevLog.multipleFaceCount + 1,
      }));
      toast.warn("Multiple faces detected! Screenshot captured.");
    }
  };

  return (
    <PageContainer title="TestPage" description="This is TestPage">
      <Box pt="3rem">
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <BlankCard>
              <Box
                width="100%"
                minHeight="400px"
                boxShadow={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {isLoading || !questions.length ? (
                  <CircularProgress />
                ) : (
                  <MultipleChoiceQuestion
                    submitTest={handleTestSubmission}
                    questions={questions}
                    saveUserTestScore={saveUserTestScore}
                  />
                )}
              </Box>
            </BlankCard>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BlankCard>
                  <NumberOfQuestions
                    questionLength={questions.length}
                    submitTest={handleTestSubmission}
                    examDurationInSeconds={examDurationInSeconds}
                  />
                </BlankCard>
              </Grid>
              <Grid item xs={12}>
                <BlankCard>
                  <WebCamCapture 
                    onCapture={handleScreenshotCapture} 
                    onObjectDetected={handleObjectDetected} 
                  />
                </BlankCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default TestPage;
