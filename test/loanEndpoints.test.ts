import request from 'supertest';
import app from '../src/app';

describe('Loan Application Endpoints', () => {
  
  describe('GET /api/v1/loans', () => {
    it('should return 200 with success status', async () => {
      const response = await request(app)
        .get('/api/v1/loans')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/v1/loans', () => {
    it('should return 201 with success status', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({ amount: 250000 })
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/v1/loans/:id/review', () => {
    it('should return 200 with success status', async () => {
      const response = await request(app)
        .put('/api/v1/loans/1/review')
        .send({ notes: 'Reviewed' })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/v1/loans/:id/approve', () => {
    it('should return 200 with success status', async () => {
      const response = await request(app)
        .put('/api/v1/loans/1/approve')
        .send({ notes: 'Approved' })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  });
});
