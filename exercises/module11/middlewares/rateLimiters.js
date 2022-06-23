const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute time limit
    max: 5,
    //message: 'Too many failed login requests. Try again later'
    handler: (req, res, next) =>{
        let err = new Error('Too many failed login requests. Try again later');
        err.status = 429;
        return next(err);
    }
});