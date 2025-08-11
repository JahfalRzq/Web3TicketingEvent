// __mocks__/checkJwt.ts
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../src/types/JwtPayload";

export const checkJwt = (role: "ADMIN" | "USER" = "ADMIN") => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.jwtPayload = {
      id: "mock-user-id",
      userName: "MockUser",
      role: role,
      password: "",
      createdAt: new Date(),
    } as unknown as JwtPayload;
    next();
  };
};
