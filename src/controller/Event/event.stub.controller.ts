import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Event, typeEvent, categoryEvent } from "../../database/mysql/entities/Event";
import { User, UserRole } from "../../database/mysql/entities/User";
import { NFTMetadataModel } from "../../database/mongodb/models/nft-metadata.schema";
import { connectMongo } from "../../database/mongodb/connect";
import Joi from "joi";

const eventRepository = AppDataSource.getRepository(Event);
const userRepository = AppDataSource.getRepository(User);

const { successResponse, errorResponse, validationResponse } = require("../../utils/response");





export const createEventStub = async (req: Request, res: Response) => {
  // 📌 Step 1: Validasi schema input
  const createEventSchema = (input) =>
    Joi.object({
      nameEvent: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      totalTicket: Joi.number().min(0).required(),
      ticketPrice: Joi.number().min(0).required(),
      description: Joi.string().required(),
      image: Joi.string().uri().required(),
      categoryEvent: Joi.string()
        .valid(...Object.values(categoryEvent))
        .uppercase()
        .required(),
      typeEvent: Joi.string()
        .valid(...Object.values(typeEvent))
        .uppercase()
        .required(),
    }).validate(input);

  try {
    const body = req.body;
    const schema = createEventSchema(body);

    if ("error" in schema) {
      return res.status(422).send(validationResponse(schema));
    }

 // 📌 Step 2: Cek JWT payload dan hak akses user
    // console.log("JWT Payload:", req.jwtPayload); // Debug log
    
    // // Validasi JWT payload
    // if (!req.jwtPayload || !req.jwtPayload.id) {
    //   console.error("JWT payload is missing or invalid:", req.jwtPayload);
    //   return res.status(401).send(errorResponse("Unauthorized: Invalid or missing token", 401));
    // }
    
 const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
    if (!userAccess) {
      console.error("User not found with ID:", req.jwtPayload.id);
      return res.status(404).send(errorResponse("User not found", 404));
    }

    if (userAccess.role !== UserRole.ADMIN) {
      console.error("Access denied for user:", userAccess.id, "with role:", userAccess.role);
      return res.status(403).send(errorResponse("Access Denied: Only ADMIN can create event", 403));
    }

    // 📌 Step 3: Simpan event ke MySQL
    const dummyContractAddress = "0xStubContract";
    const dummyMetadataURI = `https://example.com/metadata/${Date.now()}`; // sementara pakai timestamp agar unik

    const newEvent = new Event();
    newEvent.nameEvent = body.nameEvent.trim();
    newEvent.location = body.location;
    newEvent.startDate = new Date(body.startDate);
    newEvent.endDate = new Date(body.endDate);
    newEvent.alamatEvent = body.location;
    newEvent.categoryEvent = body.categoryEvent.toUpperCase();
    newEvent.typeEvent = body.typeEvent.toUpperCase();
    newEvent.totalTicket = body.totalTicket;
    newEvent.ticketPrice = body.ticketPrice;
    newEvent.contract_address = dummyContractAddress;
    newEvent.metadata_uri = dummyMetadataURI;
    newEvent.description = body.description;
    newEvent.image = body.image.trim();
    // newEvent.userOrganizer = userAccess;

    const savedEvent = await eventRepository.save(newEvent);
    if (!savedEvent || !savedEvent.id) {
      throw new Error("Failed to save event to MySQL");
    }

    // 📌 Step 4: Koneksi MongoDB (pastikan terkoneksi)
    try {
      await connectMongo();
    } catch (mongoConnErr) {
      console.error("MongoDB connection failed:", mongoConnErr);
      return res.status(500).send(errorResponse("Failed to connect to MongoDB", 500));
    }

    // 📌 Step 5: Simpan metadata NFT ke MongoDB
    try {
      const newMetadata = new NFTMetadataModel({
        eventId: savedEvent.id, // simpan sebagai string agar kompatibel
        name: body.nameEvent,
        description: body.description,
        image: body.image,
        attributes: [
          { trait_type: "location", value: body.location },
          { trait_type: "date", value: `${body.startDate} - ${body.endDate}` },
        ],
        contractAddress: dummyContractAddress,
        metadataURI: dummyMetadataURI,
      });

      await newMetadata.save();

      return res.status(201).send(
        successResponse(
          "Event created successfully with stub metadata",
          { event: savedEvent, metadata: newMetadata },
          201
        )
      );
    } catch (mongoSaveErr) {
      console.error("MongoDB metadata save error:", mongoSaveErr);
      return res.status(500).send(errorResponse("Failed to save metadata to MongoDB", 500));
    }
  } catch (error: any) {
    console.error("createEventStub error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};

export const getAllEventsStub = async (req: Request, res: Response) => {
  try {
    const eventData = await eventRepository.find({
      relations: {
        userOrganizer: true, // jika ingin menyertakan nama organizer
      },
      order: { startDate: "ASC" },
    });

    return res.status(200).send(successResponse("List of events", eventData, 200));

  } catch (error: any) {
    console.error("getAllEvents error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send(errorResponse("Event ID is required", 400));
    }

    const event = await eventRepository.findOne({
      where: { id },
      relations: ["userOrganizer"], // join user
    });

    if (!event) {
      return res.status(404).send(errorResponse("Event not found", 404));
    }

    return res.status(200).send(successResponse("Event detail", { event }, 200));
  } catch (error: any) {
    console.error("getEventById error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};