import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import goalRoutes from './routes/goalRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/goals', goalRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (deve ser o último middleware)
app.use(errorHandler);

// Inicializar servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await connectDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Meta Compartilhada - Backend API    ║
╠════════════════════════════════════════╣
║  Servidor rodando em: http://localhost:${PORT}
║  Ambiente: ${process.env.NODE_ENV || 'development'}
║  MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-compartilhada'}
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Encerrando servidor...');
  process.exit(0);
});
