const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8 & 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8 & 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        })
        return res.redirect('back');
    }else{
        return next();
    }
}

exports.validateNewConnection = [body('date').isDate().withMessage('Date must be a valid date').isAfter().withMessage('Date must be after today'),
body('startTime', 'Must be a valid time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
body('endTime', 'Must be a valid time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).custom((endTime, {req})=>{
    let startTime = req.body.startTime;
    let startTimeMins = parseInt(startTime.split(":")[0])*60 + parseInt(startTime.split(":")[1]);
    let endTimeMins = parseInt(endTime.split(":")[0])*60 + parseInt(endTime.split(":")[1]);

    return (endTimeMins > startTimeMins);
    
})
];

