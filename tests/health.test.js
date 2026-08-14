const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});

describe('GET /', () => {
  it('returns service info', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.service).toBe('sample-app');
  });
});

describe('GET /unknown-route', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});