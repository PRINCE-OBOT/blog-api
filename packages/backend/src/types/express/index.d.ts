import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
    }

    interface Request {
      user: User;
    }
  
    interface JWTPayload {
      user: User;
    }
  }
}

export {};
