const APIError  = require("../util/APIError");

const errorhandler = ((err, req, res, next) => {
    //1- Validation Error
    if (err.name === "validationError") {
        return res.status(400).json({ status: "error", message: err.message });
    }
    //2- Duplicate Key Error
    if (err.name === err.code === 11000) {
        return res.status(400).json({ status: "error", message: "Duplicate key Error" });
    }
    //3- Not Found Error
    if (err.name === "CastError") {
        return res.status(404).json({ status: "error", message: "Not found" });
    }

     //4- jwt error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ status: "failure", message: "Unauthorized" });
  }
  
    console.error(err.stack);
    if (err instanceof APIError) {
      return res
        .status(err.status)
        .json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: err.message });
  });
  module.exports = errorhandler;