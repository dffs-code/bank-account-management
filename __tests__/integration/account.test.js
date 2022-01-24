const request = require('supertest')

const app = require('../../src/server.js');

describe('Account Tests', () => {
  it('Should get all accounts', async () => {
    await request(app).get('/accounts').then((response) => {
      expect(response.status).toBe(200);
    });
  });
});