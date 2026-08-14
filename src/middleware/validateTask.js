const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTaskCreate(req, res, next) {
  const { title, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: 'title must be 200 characters or fewer' });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, priority, completed } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed must be a boolean' });
  }

  next();
}

module.exports = { validateTaskCreate, validateTaskUpdate, VALID_PRIORITIES };