//created custom Error class so that we dont have to repeat same line of error code
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode > 400 || statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, CustomError);
  }
}

export const errorHandler = (error, req, res, next) => {
  const message = error?.message || "something went wrong";
  const statusCode = error.statusCode || 500; //everytime status code 500 jaxa so error msg aako jasari status code ni mageko, if xaina vani chai 500 status code pass send gardeko
  const status = error?.status || "Server Error"; //error .status xa vani status aauxa ntra msg send hunxa server error vanera
  const success = error?.success || false;
  res.status(statusCode).json({
    message: message,
    status,
    success,
    data: null,
    originalError: process.env.NODE_ENV === "development" ? error.stack : null,
    //env ko value development xa vani tyo error janxa ntra null janxa
  });
};

export default CustomError;
