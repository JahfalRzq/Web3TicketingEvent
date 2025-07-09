import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { User, UserRole } from "../../database/mysql/entities/User";
import { Event, categoryEvent, typeEvent } from "../../database/mysql/entities/Event";
import { Ticket, statusTransaction } from "../../database/mysql/entities/Ticket";
import { encrypt } from "../../utils/CryptoData";
const { successResponse, errorResponse, validationResponse } = require('../../utils/response')
import { SeedLog } from "../../database/mongodb/models/SeedLog";
import { connectMongo } from "../../database/mongodb/connect"; // ⬅️ Tambahkan ini

const userRepo = AppDataSource.getRepository(User);
const eventRepo = AppDataSource.getRepository(Event);
const ticketRepo = AppDataSource.getRepository(Ticket);

export const fullSeeder = async (req: Request, res: Response) => {
  try {
    // 🧑‍💼 Admin
    const admin = userRepo.create({
      userName: "Admin1",
      namaLengkap: "Admin Satu",
      walletAddress: "",
      password: encrypt("Admin123!"),
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);

    // 🎤 Organizer
    const organizer = userRepo.create({
      userName: "Organizer1",
      namaLengkap: "Organizer Utama",
      walletAddress: "0xABC123456789",
      password: encrypt("Organizer123!"),
      role: UserRole.EVENTORGANIZER,
    });
    await userRepo.save(organizer);

    // 👤 Buyer
    const buyer = userRepo.create({
      userName: "Buyer1",
      namaLengkap: "Pembeli Event",
      walletAddress: "0xDEF987654321",
      password: encrypt("Buyer123!"),
      role: UserRole.USER,
    });
    await userRepo.save(buyer);

    // 🎫 Event by Organizer
    const event = eventRepo.create({
      nameEvent: "Jakarta Web3 Conference",
      alamatEvent: "Balai Kartini, Jakarta",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-03"),
      categoryEvent: categoryEvent.Web3,
      typeEvent: typeEvent.Nasional,
      totalTicket: 2,
      ticketPrice: 0.05,
      contract_address: "0xEventContractAddress",
      metadata_uri: "https://ipfs.io/ipfs/metadata_uri",
      userOrganizer: organizer,
    });
    await eventRepo.save(event);

    // 🎟️ Ticket 1
    const ticket1 = ticketRepo.create({
      tokenId: "TICKET-001",
      status: statusTransaction.active,
      tx_hash: "0xhash1",
      minted_at: new Date(),
      event_id: event,
      owner_id: buyer,
    });
    await ticketRepo.save(ticket1);

    // 🎟️ Ticket 2
    const ticket2 = ticketRepo.create({
      tokenId: "TICKET-002",
      status: statusTransaction.transferred,
      tx_hash: "0xhash2",
      minted_at: new Date(),
      event_id: event,
      owner_id: buyer,
    });
    await ticketRepo.save(ticket2);

    // 🧾 Log ke MongoDB
    await connectMongo(); // ⬅️ Inisialisasi koneksi MongoDB dulu
    await SeedLog.create({
      action: "Seed MySQL & MongoDB",
      actor: "System",
      details: {
        admin: admin.userName,
        organizer: organizer.userName,
        buyer: buyer.userName,
        event: event.nameEvent,
        tickets: [ticket1.tokenId, ticket2.tokenId],
      },
    });

    return res.status(201).send(successResponse("Seeder berhasil disimpan ke MySQL & MongoDB", null));
  } catch (err) {
    console.error("Seeder error:", err);
    return res.status(500).send(errorResponse("Seeder gagal", 500));
  }
};
