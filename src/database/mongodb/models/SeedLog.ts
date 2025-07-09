import mongoose from "mongoose";

const SeedLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actor: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed,
});

export const SeedLog = mongoose.model("SeedLog", SeedLogSchema);
