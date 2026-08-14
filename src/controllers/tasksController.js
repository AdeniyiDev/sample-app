const taskStore = require('../models/taskStore');
const logger = require('../utils/logger');

function listTasks(req, res) {
  const { completed, priority } = req.query;
  let tasks = taskStore.getAll();

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    tasks = tasks.filter((task) => task.completed === isCompleted);
  }

  if (priority) {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  res.json({ count: tasks.length, tasks });
}

function getTask(req, res) {
  const task = taskStore.getById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.json(task);
}

function createTask(req, res) {
  const task = taskStore.create(req.body);
  logger.info('Task created', { id: task.id, title: task.title });
  res.status(201).json(task);
}

function updateTask(req, res) {
  const task = taskStore.update(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  logger.info('Task updated', { id: task.id });
  res.json(task);
}

function deleteTask(req, res) {
  const deleted = taskStore.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  logger.info('Task deleted', { id: req.params.id });
  res.status(204).send();
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };