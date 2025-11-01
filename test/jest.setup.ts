// Shared Jest setup to mock Firebase Admin for tests
// This file is referenced by jest.config.js via setupFilesAfterEnv

// Create a shared auth mock used by middleware and controllers
const auth = {
  verifyIdToken: jest.fn(async (token: string) => {
    if (token === 'valid-manager-token') return { uid: 'manager-uid', role: 'manager' };
    if (token === 'valid-user-token') return { uid: 'user-uid', role: 'user' };
    if (token === 'valid-officer-token') return { uid: 'officer-uid', role: 'officer' };
    // Any other token will be treated as decoding error
    throw new Error('Decoding Firebase ID token failed.');
  }),
  setCustomUserClaims: jest.fn(async (uid: string, claims: any) => Promise.resolve()),
  getUser: jest.fn(async (id: string) => ({ uid: id, email: `${id}@example.com` })),
};

// Attach to global for tests that want to inspect call history
// (e.g., (global as any).authMock)
(global as any).authMock = auth;

// Mock the firebaseConfig module used by the application
jest.mock('../src/config/firebaseConfig', () => ({
  auth,
  db: {},
}));
