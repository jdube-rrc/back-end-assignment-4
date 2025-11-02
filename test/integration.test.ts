import request from 'supertest';
import app from '../src/app';

describe('Integration tests - secured loan endpoints', () => {
  test('GET /api/v1/loans - manager allowed', async () => {
    await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-manager-token')
      .expect(200);
  });

  test('GET /api/v1/loans - officer allowed', async () => {
    await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-officer-token')
      .expect(200);
  });

  test('GET /api/v1/loans - user forbidden', async () => {
    const resp = await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-user-token')
      .expect(403);
    expect(resp.body.error).toBeDefined();
  });

  test('POST /api/v1/loans - user allowed', async () => {
    await request(app)
      .post('/api/v1/loans')
      .set('Authorization', 'Bearer valid-user-token')
      .send({ amount: 100000 })
      .expect(201);
  });

  test('POST /api/v1/loans - manager forbidden', async () => {
    const resp = await request(app)
      .post('/api/v1/loans')
      .set('Authorization', 'Bearer valid-manager-token')
      .send({ amount: 100000 })
      .expect(403);
    expect(resp.body.error).toBeDefined();
  });

  test('PUT /api/v1/loans/:id/review - officer allowed', async () => {
    await request(app)
      .put('/api/v1/loans/1/review')
      .set('Authorization', 'Bearer valid-officer-token')
      .send({ notes: 'ok' })
      .expect(200);
  });

  test('PUT /api/v1/loans/:id/review - manager forbidden', async () => {
    const resp = await request(app)
      .put('/api/v1/loans/1/review')
      .set('Authorization', 'Bearer valid-manager-token')
      .send({ notes: 'ok' })
      .expect(403);
    expect(resp.body.error).toBeDefined();
  });

  test('PUT /api/v1/loans/:id/approve - manager allowed', async () => {
    await request(app)
      .put('/api/v1/loans/1/approve')
      .set('Authorization', 'Bearer valid-manager-token')
      .send({ notes: 'approve' })
      .expect(200);
  });

  test('PUT /api/v1/loans/:id/approve - officer forbidden', async () => {
    const resp = await request(app)
      .put('/api/v1/loans/1/approve')
      .set('Authorization', 'Bearer valid-officer-token')
      .send({ notes: 'approve' })
      .expect(403);
    expect(resp.body.error).toBeDefined();
  });

  test('Missing token returns 401', async () => {
    await request(app).get('/api/v1/loans').expect(401);
  });
});
