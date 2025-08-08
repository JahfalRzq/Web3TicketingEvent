import request from "supertest";
import app from "../src/app";
import jwt from "jsonwebtoken";
import { UserRole } from "../src/database/mysql/entities/User";

// Mock userRepository
jest.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (entity.name === "User") {
        return {
          findOneBy: jest.fn().mockResolvedValue({
            id: "mock-user-id",
            userName: "mockuser",
            password: "hashedpassword",
            role: UserRole.ADMIN,
          }),
        };
      }
      return {};
    }),
    isInitialized: true,
  },
}));

describe("JWT Auth middleware", () => {
  const secret = process.env.JWT_SECRET || "secret123";
  const mockToken = jwt.sign({ id: "mock-user-id", role: UserRole.ADMIN }, secret, {
    expiresIn: "1h",
  });

  it("should allow request with valid token", async () => {
    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer ${mockToken}`);

    // karena repo di-mock, ini otomatis sukses walau tanpa DB
    expect(res.status).toBe(200);
  });

  it("should reject request with invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer invalidtoken`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("JWT Error");
  });
});
