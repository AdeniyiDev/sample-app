const { randomUUID } = require('crypto');

// In-memory store - deliberately no database dependency, keeps the
// sample app self-contained and easy to run in CI without extra services.
let tasks = [];

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((task) => task.id === id);
}

function create({ title, description = '', priority = 'medium' }) {
  const task = {
    id: randomUUID(),
    title,
    description,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function update(id, updates) {
  const task = getById(id);
  if (!task) {
    return null;
  }

  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  return task;
}

function remove(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}

function clear() {
  tasks = [];
}

module.exports = { getAll, getById, create, update, remove, clear };