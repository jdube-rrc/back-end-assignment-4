import express from 'express';
import request from 'supertest';

import authorize from '../src/api/v1/middleware/authorize';
import errorHandler from '../src/api/v1/middleware/errorHandler';

describe('authorize middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    // middleware to set res.locals like authenticate would
    app.use((req, res, next) => {
      res.locals.uid = 'user-123';
      res.locals.role = req.headers['x-role'] || undefined;
      next();
    });

  // protected route: allow manager or admin
    app.get('/admin-only', authorize({ hasRole: ['manager', 'admin'] }), (req, res) => res.json({ ok: true }));

  // route allowing same-user access
    app.get('/self/:id', authorize({ hasRole: ['user'], allowSameUser: true }), (req, res) => res.json({ ok: true }));

  // attach global error handler so authorization errors are formatted
  app.use(errorHandler);
  });

  it('allows access when role matches', async () => {
    await request(app).get('/admin-only').set('x-role', 'manager').expect(200);
  });

  it('denies access when role does not match', async () => {
    const resp = await request(app).get('/admin-only').set('x-role', 'user').expect(403);
    expect(resp.body.error).toBeDefined();
  });

  it('allows same-user access when allowSameUser is true', async () => {
    // uid in res.locals is 'user-123' per middleware above
    await request(app).get('/self/user-123').set('x-role', 'user').expect(200);
  });
});
