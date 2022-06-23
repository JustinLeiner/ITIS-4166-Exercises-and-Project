const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMS: 60 * 1000,
    max: 5,
    //message: 'Too many login attempts, try again later',
    handler: (req, res, next)=>{
        let err = new Error('Too many login attempts, try again later');
        err.status = 429;
        return next(err);
    }

});