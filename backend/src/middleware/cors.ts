import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8081').split(',');

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS não permitido'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
