import request from 'supertest';
import app from '../src/app';

describe('Admin and User endpoints with mocked Firebase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/v1/admin/set-claims - manager can set claims', async () => {
    const response = await request(app)
      .post('/api/v1/admin/set-claims')
      .set('Authorization', 'Bearer valid-manager-token')
      .send({ uid: 'some-user-uid', claims: { role: 'officer' } })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  test('GET /api/v1/users/:id - authenticated user can fetch user details', async () => {
    const response = await request(app)
      .get('/api/v1/users/user-123')
      .set('Authorization', 'Bearer valid-user-token')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.uid).toBe('user-123');
  });

  test('GET /api/v1/users/:id - missing token returns 401', async () => {
    const response = await request(app).get('/api/v1/users/user-123').expect(401);
    expect(response.body.error).toBeDefined();
  });

  test('POST /api/v1/admin/set-claims - user without role should be forbidden', async () => {
    const response = await request(app)
      .post('/api/v1/admin/set-claims')
      .set('Authorization', 'Bearer valid-user-token')
      .send({ uid: 'some-user-uid', claims: { role: 'officer' } })
      .expect(403);

    expect(response.body.error).toBeDefined();
  });

  test('GET /api/v1/users/:id - invalid token returns 401', async () => {
    const response = await request(app)
      .get('/api/v1/users/user-123')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.error).toBeDefined();
  });
});
 
