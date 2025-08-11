import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { checkJwt } from "../__mocks__/checkJWT";
import * as eventController from "../src/controller/Event/event.stub.controller";
// import { successResponse, errorResponse } from "../src/utils/response";

// Mock DB Repository
jest.mock("../src/database/mysql/repositories/event.repository", () => ({
  eventRepository: {
    find: jest.fn().mockResolvedValue([
      { id: "1", nameEvent: "Mock Event", location: "Mock City" },
    ]),
    save: jest.fn().mockImplementation((data) =>
      Promise.resolve({ ...data, id: "mock-event-id" })
    ),
  },
}));

jest.mock("../src/database/mysql/repositories/user.repository", () => ({
  userRepository: {
    findOneBy: jest.fn().mockResolvedValue({ id: "mock-user-id", role: "ADMIN" }),
  },
}));

// Express app khusus untuk test
const app = express();
app.use(bodyParser.json());

// Routes untuk test
app.get("/api/v1/eventStub/get-all-events", eventController.getAllEvents);
app.post(
  "/api/v1/eventStub/create-event",
  checkJwt("ADMIN"),
  eventController.createEventStub
);

describe("Event Stub Controller (Mock)", () => {
  describe("GET /get-all-events", () => {
    it("✅ should return events data", async () => {
      const res = await request(app).get("/api/v1/eventStub/get-all-events");

      expect(res.status).toBe(200);
      expect(res.body.error).toBe(false);
      expect(res.body.results.length).toBeGreaterThan(0);
    });

    it("❌ should handle internal server error", async () => {
      jest
        .spyOn(require("../src/database/mysql/repositories/event.repository").eventRepository, "find")
        .mockRejectedValueOnce(new Error("DB error"));

      const res = await request(app).get("/api/v1/eventStub/get-all-events");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe(true);
    });
  });

  describe("POST /create-event", () => {
    const validEvent = {
      nameEvent: "Mock Event",
      location: "Mock City",
      startDate: "2025-08-15",
      endDate: "2025-08-16",
      totalTicket: 100,
      ticketPrice: 50000,
      description: "Mock Description",
      image: "https://example.com/image.png",
    };

    it("✅ should create event successfully", async () => {
      const res = await request(app)
        .post("/api/v1/eventStub/create-event")
        .send(validEvent);

      expect(res.status).toBe(201);
      expect(res.body.error).toBe(false);
      expect(res.body.data.event.id).toBe("mock-event-id");
    });

    it("❌ should return validation error", async () => {
      const res = await request(app)
        .post("/api/v1/eventStub/create-event")
        .send({ ...validEvent, nameEvent: "" });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe(true);
    });

    it("❌ should return access denied for non-admin", async () => {
      const nonAdminApp = express();
      nonAdminApp.use(bodyParser.json());
      nonAdminApp.post(
        "/api/v1/eventStub/create-event",
        checkJwt("USER"),
        eventController.createEventStub
      );

      const res = await request(nonAdminApp)
        .post("/api/v1/eventStub/create-event")
        .send(validEvent);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe(true);
    });
  });
});
