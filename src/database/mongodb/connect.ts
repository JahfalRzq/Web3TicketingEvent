// src/database/mongodb.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'web3ticketing',
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};
