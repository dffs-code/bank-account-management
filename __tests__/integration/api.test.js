const request = require('supertest')

const app = require('../../src/server.js');

describe('Create Account Tests', () => {
  it('Should create an account', async () => {
    await request(app).post('/account').send({
      "name": "John Doe",
      "cpf": "70701951095",
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(201);
    });
  });

  it('Should not create account with existing cpf', async () => {
    await request(app).post('/account').send({
      "name": "John Doe",
      "cpf": "70701951095",
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(400);
    });
  });

  it('Should create another account', async () => {
    await request(app).post('/account').send({
      "name": "Dohn Joe",
      "cpf": "73563120005",
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(201);
    });
  });

  
});
describe('Get Accounts Tests', () => {
  it('Should get accounts with ID 1', async () => {
    await request(app).get('/accounts/1').then((response) => {
      expect(response.body.id).toBe(1);
    });
  });
  
  it('Should get all accounts', async () => {
    await request(app).get('/accounts').then((response) => {
      expect(response.status).toBe(200);
    });
  });
})

describe('Depositing Cash on Account', () => {
  it('Should deposit R$ 20,50 on first account', async () => {
    await request(app).post('/account/deposit').send({
      "cash": 20.50,
      "cpf": "70701951095",
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(200);
    });
  });

  it('Should not deposit more than R$ 2000', async () => {
    await request(app).post('/account/deposit').send({
      "cash": 2050,
      "cpf": "70701951095",
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(400);
    });
  });
});

describe('Creating Transfers', () => {
  it('Should make a transfer to another account', async () => {
    await request(app).post('/transfer').send({
      "sender": 1,
      "receiver": 3,
      "value": 10,
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(201);
    })
  });

  it('Should not make a transfer with negative value', async () => {
    await request(app).post('/transfer').send({
      "sender": 1,
      "receiver": 3,
      "value": -50,
      "password": "password"
    }).then((response) => {
      expect(response.status).toBe(401);
    })
  });
  it('Should get all transfers', async () => {
    await request(app).get('/transfers').then((response) => {
      expect(response.status).toBe(200);
    })
  });
  it('Should get transfers by ID', async () => {
    await request(app).get('/transfers/1').then((response) => {
      expect(response.status).toBe(200);
    })
  });
});