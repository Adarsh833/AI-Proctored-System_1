const tabSwitchingMiddleware = (req, res, next) => {
    if (req.path === '/api/exams/tab-switch') {
      console.log(`Tab switch detected for user: ${req.user.id}`);
    }
    next();
  };
  
  export default tabSwitchingMiddleware;