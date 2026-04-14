import { Request, Response } from 'express';
import { Goal } from '../models/Goal.js';
import { z } from 'zod';

// Schemas de validação
const CreateGoalSchema = z.object({
  itemName: z.string().min(1, 'Nome do item é obrigatório'),
  totalValue: z.number().positive('Valor total deve ser positivo'),
  months: z.number().positive('Número de meses deve ser positivo'),
  contributionP1: z.number().positive('Contribuição deve ser positiva'),
  nameP1: z.string().min(1, 'Nome da pessoa 1 é obrigatório'),
  nameP2: z.string().min(1, 'Nome da pessoa 2 é obrigatório'),
});

const UpdateGoalSchema = CreateGoalSchema.partial();

// Obter todas as metas
export async function getAllGoals(req: Request, res: Response) {
  try {
    const goals = await Goal.find();
    res.json({ success: true, data: goals });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar metas' });
  }
}

// Obter uma meta específica
export async function getGoalById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Meta não encontrada' });
    }
    
    res.json({ success: true, data: goal });
  } catch (error) {
    console.error('Erro ao buscar meta:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar meta' });
  }
}

// Criar nova meta
export async function createGoal(req: Request, res: Response) {
  try {
    const validatedData = CreateGoalSchema.parse(req.body);
    
    const goal = new Goal({
      ...validatedData,
      savedP1: 0,
      savedP2: 0,
      payments: []
    });
    
    await goal.save();
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ success: false, error: 'Erro ao criar meta' });
  }
}

// Atualizar meta
export async function updateGoal(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = UpdateGoalSchema.parse(req.body);
    
    const goal = await Goal.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Meta não encontrada' });
    }
    
    res.json({ success: true, data: goal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar meta' });
  }
}

// Deletar meta
export async function deleteGoal(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const goal = await Goal.findByIdAndDelete(id);
    
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Meta não encontrada' });
    }
    
    res.json({ success: true, message: 'Meta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    res.status(500).json({ success: false, error: 'Erro ao deletar meta' });
  }
}

// Adicionar pagamento a uma meta
export async function addPaymentToGoal(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { paymentId, amount, payerId } = req.body;
    
    if (!paymentId || !amount || !payerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'paymentId, amount e payerId são obrigatórios' 
      });
    }
    
    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Meta não encontrada' });
    }
    
    // Adicionar pagamento
    goal.payments.push({
      paymentId,
      amount,
      payerId,
      date: new Date()
    } as any);
    
    // Atualizar saved baseado no payerId
    if (payerId === goal.nameP1) {
      goal.savedP1 += amount;
    } else if (payerId === goal.nameP2) {
      goal.savedP2 += amount;
    }
    
    await goal.save();
    res.json({ success: true, data: goal });
  } catch (error) {
    console.error('Erro ao adicionar pagamento:', error);
    res.status(500).json({ success: false, error: 'Erro ao adicionar pagamento' });
  }
}

// Obter progresso da meta
export async function getGoalProgress(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Meta não encontrada' });
    }
    
    const totalSaved = goal.savedP1 + goal.savedP2;
    const progressPercentage = (totalSaved / goal.totalValue) * 100;
    
    res.json({
      success: true,
      data: {
        totalValue: goal.totalValue,
        totalSaved,
        savedP1: goal.savedP1,
        savedP2: goal.savedP2,
        progressPercentage: Math.min(progressPercentage, 100),
        isComplete: totalSaved >= goal.totalValue
      }
    });
  } catch (error) {
    console.error('Erro ao obter progresso:', error);
    res.status(500).json({ success: false, error: 'Erro ao obter progresso' });
  }
}
