const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost, isNotHost} = require('../middlewares/auth');
const {validateNewConnection, validateResult} = require('../middlewares/validator');

const router = express.Router();


// GET /connections: send all conenctionsto the user

router.get('/', controller.connections);

router.get('/newConnection', isLoggedIn, controller.newConnection);

// POST /connections: creates a new connection
router.post('/', isLoggedIn, validateNewConnection, validateResult, controller.create);

router.get('/:id', controller.connection);

// PUT /connections/:id: update the connection identified by ID
router.put('/:id', isLoggedIn, isHost, controller.update);

router.get('/:id/edit', isLoggedIn, isHost, validateResult, controller.edit);

router.delete('/:id', isLoggedIn, isHost, controller.delete);

//
router.post('/:id/rsvp', isLoggedIn, isNotHost, controller.rsvp);



module.exports = router;