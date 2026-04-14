import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  console.error(`[${new Date().toISOString()}] Erro:`, {
    status,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.method} ${req.path}`
  });
}
