const jwt = require('jsonwebtoken');
const {validationResult}= require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error= {};
    errors.array().forEach((err) => (error[err.param] = err.msg));
    const firstErrorMessage = errors.array()[0].msg;
    return res.status(401).json({
        requestSuccesful : false,
        message : firstErrorMessage
    });

  }

  next();
}

module.exports = validate