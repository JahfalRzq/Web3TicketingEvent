import request from "supertest";
import app from "../src/app"; // app tanpa listen()
import jwt from "jsonwebtoken";
import { UserRole } from "../src/database/mysql/entities/User";

// Mock AppDataSource
jest.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation(() => ({
      find: jest.fn().mockResolvedValue([
        {
          id: "event-1",
          nameEvent: "Mock Event 1",
          location: "Jakarta",
          startDate: new Date("2025-12-01"),
          endDate: new Date("2025-12-02"),
          totalTicket: 100,
          ticketPrice: 50000,
          description: "Event Mocking",
        },
      ]),
    })),
    isInitialized: true,
  },
}));

jest.mock("../src/database/mongodb/connect", () => ({
  connectMongo: jest.fn().mockResolvedValue(true),
}));

describe("GET /api/v1/eventStub/get-all-events (mocked)", () => {
  const mockToken = jwt.sign({ id: "mock-user-id", role: UserRole.ADMIN }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  it("should return 200 and mocked events", async () => {
    const res = await request(app)
      .get("/api/v1/eventStub/get-all-events")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].id).toBe("event-1");
  });
});
