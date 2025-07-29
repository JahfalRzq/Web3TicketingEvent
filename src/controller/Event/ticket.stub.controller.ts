import { Request, Response } from "express";

export const mintTicketStub = async (req: Request, res: Response) => {
  try {
    // TODO: Simulasi mint NFT Ticket
    // Input: { eventId, buyerAddress }

    const dummyTokenId = "0";
    const dummyTxHash = "0xDummyTxHash";

    return res.status(200).json({
      message: "Stub NFT ticket minted",
      data: {
        tokenId: dummyTokenId,
        txHash: dummyTxHash,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Minting failed", error });
  }
};
