import { Request, Response } from "express";
import { AppDataSource } from "../../data-source"; // Sesuaikan path ini
import { Event } from "../../database/mysql/entities/Event"; // Sesuaikan path ini
import { NFTMetadataModel } from "../../database/mongodb/models/nft-metadata.schema";

export const createEventStub = async (req: Request, res: Response) => {
  try {
    const {
      nameEvent,
      location,
      startDate,
      endDate,
      totalTicket,
      ticketPrice,
      description,
      image,
    } = req.body;

    // 1. Simpan event ke MySQL
    const eventRepo = AppDataSource.getRepository(Event);
    const newEvent = eventRepo.create({
      nameEvent,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalTicket,
      ticketPrice,
    });

    const savedEvent = await eventRepo.save(newEvent);

    // 2. Simulasikan hasil smart contract
    const dummyContractAddress = "0xStubContract";
    const dummyMetadataURI = `https://example.com/metadata/${savedEvent.id}`;

    // 3. Simpan metadata ke MongoDB
    const newMetadata = new NFTMetadataModel({
      eventId: savedEvent.id,
      name,
      description,
      image,
      attributes: [
        { trait_type: "location", value: location },
        { trait_type: "date", value: `${startDate} - ${endDate}` },
      ],
      contractAddress: dummyContractAddress,
      metadataURI: dummyMetadataURI,
    });

    await newMetadata.save();

    return res.status(201).json({
      message: "Event created & metadata saved",
      data: {
        event: savedEvent,
        metadata: newMetadata,
      },
    });
  } catch (error: any) {
    console.error("Error in createEventStub:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
