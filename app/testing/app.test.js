const request = require('supertest');
require('dotenv').config();

const connection = require('../middleware/db_connect');
const app = require('../app');

const util = require('util');

beforeAll(async () => {
  // Pastikan DB connect sebelum test jalan
 connection.query = util.promisify(connection.query);
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
    expect(response.text).toMatch(/Hello this Apps 1!/i);
  });

  it('GET /app2 should respond with "Hello App2!"', async () => {
    const response = await request(app).get('/app2');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/Hello this App 2!/i);
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

  it('GET /users with broken query should return 500', async () => {
    // sementara timpa method query biar simulate error
    const originalQuery = connection.query;
    connection.query = jest.fn((sql, cb) => cb(new Error('Simulated DB error')));

    const response = await request(app).get('/users');
    expect(response.status).toBe(500); // pastikan kamu set status 500 di app.js
    expect(response.body).toHaveProperty('error');

    // balikin lagi query ke aslinya biar test lain nggak error
    connection.query = originalQuery;
  });


  it('DB query should return at least 1 record from users table', async () => {
    const rows = await connection.query('SELECT * FROM tb_data LIMIT 1');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('DB should reject invalid SQL query', async () => {
    await expect(connection.query('SELECT * FROM non_existing_table'))
    .rejects.toThrow();
  });
});
