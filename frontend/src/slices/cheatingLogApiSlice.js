import { apiSlice } from './apiSlice';

// Define the base URL for the exams API
const EXAMS_URL = '/api/users';

// Inject endpoints for the exam slice
export const cheatingLogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get cheating logs for a specific exam
    getCheatingLogs: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/cheatingLogs/${examId}`, // Updated route
        method: 'GET',
      }),
    }),
    // Save a new cheating log entry for an exam
    saveCheatingLog: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/cheatingLogs`, // Updated route
        method: 'POST',
        body: data,
      }),
    }),
  }),
});



// Export the generated hooks for each endpoint
export const { useGetCheatingLogsQuery, useSaveCheatingLogMutation } = cheatingLogApiSlice;

// import { apiSlice } from './apiSlice';

// // Define the base URL for the cheating logs API
// const CHEATING_LOGS_URL = '/api';

// // Inject endpoints for the cheating log slice
// export const cheatingLogApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get cheating logs for a specific exam
//     getCheatingLogs: builder.query({
//       query: (examId) => ({
//         url: `${CHEATING_LOGS_URL}/cheatingLogs/${examId}`, // Correct route
//         method: 'GET',
//       }),
//     }),
//     // Save a new cheating log entry for an exam
//     saveCheatingLog: builder.mutation({
//       query: (data) => ({
//         url: `${CHEATING_LOGS_URL}/cheatingLogs`, // Correct route
//         method: 'POST',
//         body: data,
//       }),
//     }),
//   }),
// });

// // Export the generated hooks for each endpoint
// export const { useGetCheatingLogsQuery, useSaveCheatingLogMutation } = cheatingLogApiSlice;
