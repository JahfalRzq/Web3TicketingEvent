import mongoose from "mongoose";

const NFTMetadataSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true, // merujuk ke event_id di MySQL
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String, // bisa URL ke IPFS atau CDN
    attributes: [
      {
        trait_type: String,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    contractAddress: {
      type: String,
      required: true,
    },
    metadataURI: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const NFTMetadataModel = mongoose.model("NFTMetadata", NFTMetadataSchema);
