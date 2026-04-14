import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-compartilhada';

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✓ MongoDB conectado com sucesso');
    return true;
  } catch (error) {
    console.error('✗ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}

export default mongoose;
