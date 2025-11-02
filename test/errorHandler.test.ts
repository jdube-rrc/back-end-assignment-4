import express from 'express';
import request from 'supertest';

import errorHandler from '../src/api/v1/middleware/errorHandler';
import { AuthenticationError, AuthorizationError, ServiceError } from '../src/api/v1/errors/errors';

describe('errorHandler middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    app.get('/auth-error', () => {
      throw new AuthenticationError('no token', 'TOKEN_NOT_FOUND');
    });

    app.get('/forbidden', () => {
      throw new AuthorizationError('no role');
    });

    app.get('/service', () => {
      throw new ServiceError('service failed');
    });

    // attach error handler last
    app.use(errorHandler);
  });

  it('formats AuthenticationError correctly', async () => {
    const resp = await request(app).get('/auth-error').expect(401);
    expect(resp.body.error).toBeDefined();
    expect(resp.body.error.message).toMatch(/no token/);
  });

  it('formats AuthorizationError correctly', async () => {
    const resp = await request(app).get('/forbidden').expect(403);
    expect(resp.body.error).toBeDefined();
  });

  it('formats ServiceError as 500 by default', async () => {
    const resp = await request(app).get('/service').expect(500);
    expect(resp.body.error).toBeDefined();
  });
});
