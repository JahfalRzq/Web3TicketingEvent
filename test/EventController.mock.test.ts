import request from "supertest";
import app from "../src/app"; // Express app tanpa listen()
import jwt from "jsonwebtoken";
import { mockAppDataSource, mockEventRepository, mockUserRepository } from "../__mocks__/db";
import { UserRole } from "../src/database/mysql/entities/User";

// Mock semua module DB
jest.mock("../src/data-source", () => ({
  AppDataSource: mockAppDataSource,
}));

jest.mock("../src/database/mongodb/connect", () => ({
  connectMongo: jest.fn().mockResolvedValue(true),
}));

describe("Event Controller (Mocked DB)", () => {
  const secret = process.env.JWT_SECRET || "secret123";
  const mockToken = jwt.sign({ id: "mock-user-id", role: UserRole.ADMIN }, secret, {
    expiresIn: "1h",
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset spy/mocks setiap test
  });

  // ✅ Test GET sukses
  it("GET /get-all-events should return 200 and mocked events", async () => {
    mockEventRepository.find.mockResolvedValueOnce([
      { id: "event-1", nameEvent: "Mock Event 1" },
    ]);

    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].id).toBe("event-1");
  });

  // ❌ Test GET error
  it("GET /get-all-events should return 500 if DB error", async () => {
    mockEventRepository.find.mockRejectedValueOnce(new Error("DB Error"));

    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  // 🔑 Test JWT valid
  it("should allow request with valid token", async () => {
    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
  });

  // 🚫 Test JWT invalid
  it("should reject request with invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer invalidtoken`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("JWT Error");
  });
});
