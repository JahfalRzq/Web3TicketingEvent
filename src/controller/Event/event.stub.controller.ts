import { Request, Response } from "express";

export const createEventStub = async (req: Request, res: Response) => {
  try {
    // TODO: Simulasi pembuatan event
    // Input: { nameEvent, startDate, endDate, totalTicket, ticketPrice, ... }

    const dummyContractAddress = "0xDummyContract";
    const dummyMetadataURI = "https://ipfs.io/ipfs/QmDummyURI";

    return res.status(201).json({
      message: "Stub event created",
      data: {
        contractAddress: dummyContractAddress,
        metadataURI: dummyMetadataURI,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating event stub", error });
  }
};
