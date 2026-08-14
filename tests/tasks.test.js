const request = require('supertest');
const createApp = require('../src/app');
const taskStore = require('../src/models/taskStore');

const app = createApp();

beforeEach(() => {
  taskStore.clear();
});

describe('POST /tasks', () => {
  it('creates a task with valid data', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Write CI pipeline', priority: 'high' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write CI pipeline');
    expect(res.body.priority).toBe('high');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
  });

  it('defaults priority to medium when not provided', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Untitled priority task' });

    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('medium');
  });

  it('rejects a task with no title', async () => {
    const res = await request(app).post('/tasks').send({ description: 'missing title' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('rejects an invalid priority', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Bad priority', priority: 'urgent' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/priority/i);
  });
});

describe('GET /tasks', () => {
  it('returns an empty list when no tasks exist', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.tasks).toEqual([]);
  });

  it('returns all created tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Task A' });
    await request(app).post('/tasks').send({ title: 'Task B' });

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it('filters by completed status', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Finish me' });
    await request(app).patch(`/tasks/${created.body.id}`).send({ completed: true });
    await request(app).post('/tasks').send({ title: 'Still pending' });

    const res = await request(app).get('/tasks?completed=true');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.tasks[0].title).toBe('Finish me');
  });

  it('filters by priority', async () => {
    await request(app).post('/tasks').send({ title: 'Low one', priority: 'low' });
    await request(app).post('/tasks').send({ title: 'High one', priority: 'high' });

    const res = await request(app).get('/tasks?priority=high');

    expect(res.body.count).toBe(1);
    expect(res.body.tasks[0].title).toBe('High one');
  });
});

describe('GET /tasks/:id', () => {
  it('returns a single task by id', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Find me' });

    const res = await request(app).get(`/tasks/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Find me');
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/tasks/does-not-exist');

    expect(res.status).toBe(404);
  });
});

describe('PATCH /tasks/:id', () => {
  it('updates task fields', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Original title' });

    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ title: 'Updated title', completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated title');
    expect(res.body.completed).toBe(true);
  });

  it('rejects a non-boolean completed value', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Task' });

    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ completed: 'yes' });

    expect(res.status).toBe(400);
  });

  it('returns 404 when updating a non-existent task', async () => {
    const res = await request(app).patch('/tasks/does-not-exist').send({ title: 'New' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('deletes an existing task', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Delete me' });

    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/tasks/${created.body.id}`);
    expect(getRes.status).toBe(404);
  });

  it('returns 404 when deleting a non-existent task', async () => {
    const res = await request(app).delete('/tasks/does-not-exist');

    expect(res.status).toBe(404);
  });
});