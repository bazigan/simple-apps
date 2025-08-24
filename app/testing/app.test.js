const request = require('supertest');
require('dotenv').config();

const connection = require('../middleware/db_connect');
const app = require('../app');

beforeAll(async () => {
  // Pastikan DB connect sebelum test jalan
  await connection.connect();
  app.set('connection', connection);
});

afterAll(async () => {
  // Tutup koneksi setelah semua test selesai
  await connection.end();
});

describe('Express App - Unit Tests', () => {
  it('GET / should respond with index.html', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
  });

  it('GET /app1 should respond with "Hello App1!"', async () => {
    const response = await request(app).get('/app1');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/Hello App1!/i);
  });

  it('GET /app2 should respond with "Hello App2!"', async () => {
    const response = await request(app).get('/app2');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/Hello App2!/i);
  });

  it('GET /invalid should return 404 for unknown route', async () => {
    const response = await request(app).get('/invalid');
    expect(response.status).toBe(404);
  });
});

describe('Express App - Integration Tests (Database)', () => {
  it('GET /users should respond with users data', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('DB query should return at least 1 record from users table', async () => {
    const [rows] = await connection.query('SELECT * FROM users LIMIT 1');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('DB should reject invalid SQL query', async () => {
    await expect(connection.query('SELECT * FROM non_existing_table'))
      .rejects.toThrow();
  });
});
