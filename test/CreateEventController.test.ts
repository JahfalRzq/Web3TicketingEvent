import request from "supertest";
import app from "../src/app"; // gunakan app testing tanpa .listen()
import { AppDataSource } from "../src/data-source";
import { User, UserRole } from "../src/database/mysql/entities/User";
import { encrypt } from "../src/utils/CryptoData";

let jwtToken: string;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Simpan 1 admin user dan ambil tokennya
  const userRepo = AppDataSource.getRepository(User);
  const admin = userRepo.create({
    userName: "testadmin",
    namaLengkap: "Test Admin",
    walletAddress: "",
    password: encrypt("Admin123!"),
    role: UserRole.ADMIN,
  });
  await userRepo.save(admin);

  const jwt = require("jsonwebtoken");
  jwtToken = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("POST /api/v1/eventStub/create", () => {
  it("should fail when required fields are missing", async () => {
  const res = await request(app)
    .post("/api/v1/eventStub/create")
    .set("Authorization", `Bearer ${jwtToken}`)
    .send({}); // Kirim kosong  
    expect(res.status).toBe(422); // Unprocessable Entity
    expect(res.body).toHaveProperty("message");
    expect(res.body.error).toBe(true);
  });

  it("should return 201 and create event", async () => {
    const res = await request(app)
      .post("/api/v1/eventStub/create")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        nameEvent: "Test Event",
        location: "Jakarta",
        startDate: "2025-12-01",
        endDate: "2025-12-02",
        totalTicket: 100,
        ticketPrice: 50000,
        description: "Deskripsi event test",
        image: "https://example.com/image.png",
        categoryEvent: "web3",
        typeEvent: "nasional",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data.event.id");
    expect(res.body.message).toBe("Event created successfully with stub metadata");
  });
});
