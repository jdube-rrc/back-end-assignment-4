declare namespace NodeJS {
  interface Global {
    // authMock mimics the Firebase Admin auth object spies used in tests
    authMock: {
      verifyIdToken: jest.Mock<any, any>;
      setCustomUserClaims: jest.Mock<any, any>;
      getUser: jest.Mock<any, any>;
    };
  }
}

export {};
