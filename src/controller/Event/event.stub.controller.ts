import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Event } from "../../database/mysql/entities/Event";
import { NFTMetadataModel } from "../../database/mongodb/models/nft-metadata.schema";
import Joi from "joi";
import { User } from "../../database/mysql/entities/User";
import { UserRole } from "../../database/mysql/entities/User";

const { successResponse, errorResponse, validationResponse } = require('../../../utils/response')
const eventRepository = AppDataSource.getRepository(Event);
const userRepository = AppDataSource.getRepository(User);

/**
 * Helper to check ADMIN role
 */
const checkAdminAccess = async (req: Request, res: Response) => {
  const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
  if (!userAccess) {
    res.status(404).send(errorResponse("User not found", 404));
    return null;
  }
  if (userAccess.role !== UserRole.ADMIN) {
    res.status(403).send(errorResponse("Access Denied: Only ADMIN can perform this action", 403));
    return null;
  }
  return userAccess;
};

/**
 * Get All Events (MySQL + Mongo Merge)
 */
export const getAllEventsStub = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = (req.query.sortBy as string) || "createdAt"; // default kolom
    const sortOrder =
      (req.query.sortOrder as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Ambil total count untuk pagination
    const total = await eventRepository.count();

    // Ambil data dari MySQL dengan pagination & sorting
    const events = await eventRepository.find({
      skip,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });

    // Ambil ID semua event untuk query Mongo
    const eventIds = events.map((e) => e.id);

    // Ambil metadata dari Mongo berdasarkan eventId
    const metadataList = await NFTMetadataModel.find({
      eventId: { $in: eventIds },
    });

    // Merge MySQL + Mongo
    const mergedData = events.map((event) => {
      const metadata = metadataList.find((m) => m.eventId === event.id);
      return { ...event, metadata };
    });

    return res.status(200).send(
      successResponse(
        "List of events",
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          data: mergedData,
        },
        200
      )
    );
  } catch (error: any) {
    console.error("getAllEvents error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};

/**
 * Get Event By ID
 */
export const getEventByIdStub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventRepository.findOneBy({ id });

    if (!event) {
      return res.status(404).send(errorResponse("Event not found", 404));
    }

    const metadata = await NFTMetadataModel.findOne({ eventId: id });

    return res.status(200).send(successResponse("Event detail", { ...event, metadata }, 200));
  } catch (error: any) {
    console.error("getEventById error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};

/**
 * Create Event (ADMIN only)
 */
export const createEventStub = async (req: Request, res: Response) => {
const createEventSchema = Joi.object({
  nameEvent: Joi.string().required().messages({
    "any.required": "Event name is required",
    "string.empty": "Event name cannot be empty",
  }),
  location: Joi.string().required(),
  alamatEvent: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  totalTicket: Joi.number().integer().min(1).required(),
  ticketPrice: Joi.number().integer().min(0).required(),
  description: Joi.string().allow(""),
  image: Joi.string().uri().allow(""),
  typeEvent: Joi.string().valid("NASIONAL", "INTERNASIONAL").required(),
  categoryEvent: Joi.string().required(),
});
  try {
    const userAccess = await checkAdminAccess(req, res);
    if (!userAccess) return;

    const { nameEvent, location, startDate, endDate, totalTicket, ticketPrice, description, image } = req.body;

    const event = eventRepository.create({
      nameEvent,
      location,
      startDate,
      endDate,
      totalTicket,
      ticketPrice,
      description,
      image,
    });
    await eventRepository.save(event);

    await NFTMetadataModel.create({
      eventId: event.id,
      name: nameEvent,
      description,
      image,
      attributes: [
        { trait_type: "Location", value: location },
        { trait_type: "Date", value: `${startDate} - ${endDate}` }
      ]
    });

    return res.status(201).send(successResponse("Event created successfully", event, 201));
  } catch (error: any) {
    console.error("createEvent error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};

/**
 * Update Event (ADMIN only)
 */
export const updateEventStub = async (req: Request, res: Response) => {
  const updateEventSchema = Joi.object({
  nameEvent: Joi.string().optional(),
  location: Joi.string().optional(),
  alamatEvent: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  totalTicket: Joi.number().integer().min(1).optional(),
  ticketPrice: Joi.number().integer().min(0).optional(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().uri().allow("").optional(),
  typeEvent: Joi.string().valid("NASIONAL", "INTERNASIONAL").optional(),
  categoryEvent: Joi.string().optional(),
});


  try {
    const userAccess = await checkAdminAccess(req, res);
    if (!userAccess) return;

    const { id } = req.params;
    const body = req.body;

    const event = await eventRepository.findOneBy({ id });
    if (!event) {
      return res.status(404).send(errorResponse("Event not found", 404));
    }

    Object.assign(event, body);
    await eventRepository.save(event);

    await NFTMetadataModel.findOneAndUpdate(
      { eventId: id },
      {
        ...(body.nameEvent && { name: body.nameEvent }),
        ...(body.description && { description: body.description }),
        ...(body.image && { image: body.image }),
        ...(body.location && { "attributes.0.value": body.location }),
        ...(body.startDate && body.endDate && {
          "attributes.1.value": `${body.startDate} - ${body.endDate}`
        }),
      },
      { new: true }
    );

    return res.status(200).send(successResponse("Event updated successfully", event, 200));
  } catch (error: any) {
    console.error("updateEventById error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};

/**
 * Soft Delete Event (ADMIN only)
 */
export const softDeleteEventStub = async (req: Request, res: Response) => {
  try {
    const userAccess = await checkAdminAccess(req, res);
    if (!userAccess) return;

    const { id } = req.params;
    const event = await eventRepository.findOneBy({ id });

    if (!event) {
      return res.status(404).send(errorResponse("Event not found", 404));
    }

    await eventRepository.softDelete(id);
    await NFTMetadataModel.deleteOne({ eventId: id });

    return res.status(200).send(successResponse("Event deleted successfully", null, 200));
  } catch (error: any) {
    console.error("softDeleteEventById error:", error.message);
    return res.status(500).send(errorResponse("Internal server error", 500));
  }
};
