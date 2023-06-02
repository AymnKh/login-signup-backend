import Http from "http-status-codes";
function errorHanlder(err, req, res, next) { 
  if (err) { // if there is an error
    if (err.name === "UnauthorizedError") { // if the error is unauthorized
      return res.status(Http.UNAUTHORIZED).json({ // return the status unauthorized
        message: "no token provided",
      });
    }
    return res.status(Http.UNAUTHORIZED).json({ 
      message: "The user is not authorized", // return the status unauthorized
    });
  }
}

export default errorHanlder;
