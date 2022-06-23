const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiter');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');

const router = express.Router();

router.get('/new', isGuest, controller.new);

router.post('/new', isGuest, validateSignUp, validateResult, controller.createAccount);

router.get('/login', isGuest, controller.login);

router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.loginAttempt);

router.get('/profile', isLoggedIn, controller.profile);

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;