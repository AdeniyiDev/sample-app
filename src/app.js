const express = require('express');
const morgan = require('morgan');
const tasksRouter = require('./routes/tasks');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(morgan(process.env.NODE_ENV === 'test' ? 'dev' : 'combined', {
    skip: () => process.env.NODE_ENV === 'test',
  }));

  // Health check - this is what Kubernetes liveness/readiness probes
  // will call once this app is deployed on the cluster.
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/', (req, res) => {
    res.json({
      service: 'sample-app',
      message: 'Task management API - part of the Self-Service GitOps Platform project',
      endpoints: ['/health', '/tasks'],
    });
  });

  app.use('/tasks', tasksRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;