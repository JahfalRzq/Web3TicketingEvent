import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Event } from "../../database/mysql/entities/Event"; // Sesuaikan path jika perlu
import { User, UserRole } from "../../database/mysql/entities/User";
import { NFTMetadataModel } from "../../database/mongodb/models/nft-metadata.schema";
import Joi from "joi";

const eventRepository = AppDataSource.getRepository(Event);
const userRepository = AppDataSource.getRepository(User);



const { successResponse, errorResponse, validationResponse } = require("../../utils/response");

export const createEventStub = async (req: Request, res: Response) => {
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
    }).validate(input);

try {
  const body = req.body;
  const schema = createEventSchema(body);

  if ("error" in schema) {
    return res.status(422).send(validationResponse(schema));
  }

  const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });

  if (!userAccess || userAccess.role !== UserRole.ADMIN) {
    return res.status(403).send(errorResponse("Access Denied: Only ADMIN can create event", 403));
  }

  // Simpan ke MySQL
  const newEvent = new Event();
  newEvent.nameEvent = body.nameEvent;
  newEvent.location = body.location;
  newEvent.startDate = new Date(body.startDate);
  newEvent.endDate = new Date(body.endDate);
  newEvent.totalTicket = body.totalTicket;
  newEvent.ticketPrice = body.ticketPrice;
  newEvent.description = body.description;
  newEvent.image = body.image;

  console.log("log before save", newEvent);

  const result = await eventRepository.save(newEvent);
  console.log("DEBUG saved:", result);
  console.log("DEBUG ID:", result.id); // Pastikan result.id ada

  if (!result || !result.id) {
    throw new Error("Failed to save event");
  }

  // Simulasikan data smart contract
  const dummyContractAddress = "0xStubContract";
  const dummyMetadataURI = `https://example.com/metadata/${result.id}`;

  const newMetadata = new NFTMetadataModel({
    eventId: result.id,
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

  return res
    .status(201)
    .send(successResponse("Event created successfully with stub metadata", { event: newEvent, metadata: newMetadata }, 201));
} catch (error: any) {
  console.error("createEventStub error:", error.message);
  return res.status(500).send(errorResponse("Internal server error", 500));
}
};