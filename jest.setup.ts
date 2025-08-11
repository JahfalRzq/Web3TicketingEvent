// jest.setup.ts
import { jest } from "@jest/globals";

// Mock JWT middleware
jest.mock("./__mocks__/checkJwt", () => ({
  checkJwt: (role: "ADMIN" | "USER" = "ADMIN") => {
    return (req: any, _res: any, next: any) => {
      req.jwtPayload = {
        id: "mock-user-id",
        userName: "MockUser",
        role: role,
        password: "",
        createdAt: new Date(),
      } as any;
      next();
    };
  },
}));

// Mock MySQL DataSource
jest.mock("./__mocks__/db", () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(true),
    isInitialized: true,
    destroy: jest.fn().mockResolvedValue(true),
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({}),
    }),
  },
}));

// Mock Mongo connection
jest.mock("./__mocks__/mongo", () => ({
  connectMongo: jest.fn().mockResolvedValue(true),
  mongoClient: {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: "mockId" }),
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
  },
}));
