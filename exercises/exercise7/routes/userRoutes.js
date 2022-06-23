const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/new', controller.signUp);
router.post('/', controller.createNewUser);

router.get('/login', controller.login);
router.post('/login', controller.processLogin);

router.get('/profile', controller.profile);

router.get('/logout', controller.logout);

module.exports = router;