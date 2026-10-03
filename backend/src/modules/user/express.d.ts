// src/modules/user/express.d.ts
import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export {};