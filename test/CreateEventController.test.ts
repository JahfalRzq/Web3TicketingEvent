import request from "supertest";
import app from "../src/app"; // pastikan app tidak memanggil .listen()
import { UserRole } from "../src/database/mysql/entities/User";
import jwt from "jsonwebtoken";

jest.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      return {
        findOneBy: jest.fn().mockResolvedValue({
          id: "mock-user-id",
          role: UserRole.ADMIN,
        }),
        save: jest.fn().mockResolvedValue({
          id: "mock-event-id",
          nameEvent: "Test Event",
        }),
      };
    }),
    isInitialized: true,
  },
}));

jest.mock("../src/database/mongodb/connect", () => ({
  connectMongo: jest.fn().mockResolvedValue(true),
}));

jest.mock("../src/database/mongodb/models/nft-metadata.schema", () => {
  return {
    NFTMetadataModel: jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: "mock-metadata-id",
        eventId: "mock-event-id",
      }),
    })),
  };
});

describe("POST /api/v1/eventStub/create (mocked)", () => {
  const mockToken = jwt.sign({ id: "mock-user-id", role: UserRole.ADMIN }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  it("should create event and return 201", async () => {
    const res = await request(app)
      .post("/api/v1/eventStub/create")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({
        nameEvent: "Test Event",
        location: "Jakarta",
        startDate: "2025-12-01",
        endDate: "2025-12-02",
        totalTicket: 100,
        ticketPrice: 50000,
        description: "Deskripsi event test",
        image: "https://example.com/image.png",
        categoryEvent: "WEB3",
        typeEvent: "NASIONAL",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data.event.id", "mock-event-id");
    expect(res.body).toHaveProperty("data.metadata.eventId", "mock-event-id");
  });

  it("should return 422 if request body is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/eventStub/create")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({});

    expect(res.status).toBe(422);
    expect(res.body.error).toBe(true);
  });
});
