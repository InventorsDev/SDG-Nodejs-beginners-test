const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


describe('TASK API', () => {
  let mongoServer, response;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    const initTask = { title: 'New TASK Item', description: 'Adding a new task item' };
    response = await request(app).post('/api/tasks').send(initTask);
  });
  
  afterAll(async () => {
    await mongoServer.stop();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await app.close()
  });


  describe('Retrieve all Task /tasks', () => {
    it('should return all TASK items', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([
        expect.objectContaining({ title: 'New TASK Item', description: 'Adding a new task item'  }),
      ]));
    });
  });

  describe('Get Task /tasks/:id', () => {
    it('should return all TASK items', async () => {
      const res = await request(app).get(`/api/tasks/${response.body._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ title: 'New TASK Item', description: 'Adding a new task item'  }),
      );
    });
  });

  describe('POST /tasks', () => {
    it('should create a new TASK item', async () => {
      const task = { title: 'New TASK Item 1', description: 'Adding a new task item' };
      const res = await request(app).post('/api/tasks').send(task);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(task);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a TASK item', async () => {
      const task = { title: 'Updated TASK Item', description: 'Updating a new task item' };
      const res = await request(app).patch(`/api/tasks/${response.body._id}`).send(task);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(task);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a TASK item', async () => {
      const res = await request(app).delete(`/api/tasks/${response.body._id}`);
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });
  });

  describe('Mark task as completed /tasks/:id/completed', () => {
    it('should update task status as completed', async () => {
      const res = await request(app).patch(`/api/tasks/${response.body._id}/completed`).send({});
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("completed");
    });
  });
});
