//fn= function
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    //try catch repeat garna naparos vanera
    //Promise.resolve(fn(req,res,next)) == try ko part
    Promise.resolve(fn(req, res, next)).catch((error) => {next(error)});
  };
};
