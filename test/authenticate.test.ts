import express from 'express';
import request from 'supertest';

import authenticate from '../src/api/v1/middleware/authenticate';
import errorHandler from '../src/api/v1/middleware/errorHandler';

describe('authenticate middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.get('/test-auth', authenticate, (req, res) => {
      // return res.locals for assertions
      res.json({ uid: res.locals.uid, role: res.locals.role });
    });

    // attach global error handler so our tests receive consistent JSON errors
    app.use(errorHandler);
  });

  it('returns 200 and sets res.locals for valid token', async () => {
    const resp = await request(app)
      .get('/test-auth')
      .set('Authorization', 'Bearer valid-manager-token')
      .expect(200);

    expect(resp.body.uid).toBe('manager-uid');
    expect(resp.body.role).toBe('manager');
  });

  it('returns 401 for missing token', async () => {
    const resp = await request(app).get('/test-auth').expect(401);
    expect(resp.body.error).toBeDefined();
  });

  it('returns 401 for invalid token', async () => {
    const resp = await request(app)
      .get('/test-auth')
      .set('Authorization', 'Bearer invalid')
      .expect(401);
    expect(resp.body.error).toBeDefined();
  });
});
