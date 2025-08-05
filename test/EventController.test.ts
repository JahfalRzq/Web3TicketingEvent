// test/EventController.test.ts
import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { connectMongo } from '../src/database/mongodb/connect';

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await connectMongo();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("GET /api/v1/eventStub/get-all-events", () => {
  it("should return 200 and events data", async () => {
    const response = await request(app).get("/api/v1/eventStub/get-all-events");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);
  });
});
