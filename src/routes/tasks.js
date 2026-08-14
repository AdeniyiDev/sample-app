const express = require('express');
const tasksController = require('../controllers/tasksController');
const { validateTaskCreate, validateTaskUpdate } = require('../middleware/validateTask');

const router = express.Router();

router.get('/', tasksController.listTasks);
router.get('/:id', tasksController.getTask);
router.post('/', validateTaskCreate, tasksController.createTask);
router.patch('/:id', validateTaskUpdate, tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;