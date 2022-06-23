const express = require('express');
const controller = require('../controllers/storyControllers');

const router = express.Router();

// GET /stories: send all stories to the user

router.get('/', controller.index);

// GET /stories/new: send form to create a new story
router.get('/new', controller.new);

// POST /storeis: creates a new story
router.post('/', controller.create);

// GET /stories/:id: send details of story identified by ID
router.get('/:id', controller.show);

// GET /stories/:id/edit: send form to edit an existing story
router.get('/:id/edit', controller.edit);

// PUT /stories/:id: update the story identified by ID
router.put('/:id', controller.update);

// DELETE /stories/:id delete the story by ID
router.delete('/:id', controller.delete);



module.exports = router;