import { useState, useCallback, useEffect } from 'react';
import { apiService } from '@/lib/services/api';

export interface Goal {
  _id: string;
  itemName: string;
  totalValue: number;
  months: number;
  contributionP1: number;
  nameP1: string;
  nameP2: string;
  savedP1: number;
  savedP2: number;
  payments: any[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  totalValue: number;
  totalSaved: number;
  savedP1: number;
  savedP2: number;
  progressPercentage: number;
  isComplete: boolean;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as metas
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllGoals();
      if (response.success) {
        setGoals(response.data);
      } else {
        setError(response.error || 'Erro ao buscar metas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar metas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar meta específica
  const fetchGoalById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getGoalById(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar meta');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova meta
  const createGoal = useCallback(async (goalData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.createGoal(goalData);
      if (response.success) {
        setGoals([...goals, response.data]);
        return response.data;
      } else {
        setError(response.error || 'Erro ao criar meta');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar meta');
      return null;
    } finally {
      setLoading(false);
    }
  }, [goals]);

  // Atualizar meta
  const updateGoal = useCallback(async (id: string, goalData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.updateGoal(id, goalData);
      if (response.success) {
        setGoals(goals.map(g => g._id === id ? response.data : g));
        return response.data;
      } else {
        setError(response.error || 'Erro ao atualizar meta');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar meta');
      return null;
    } finally {
      setLoading(false);
    }
  }, [goals]);

  // Deletar meta
  const deleteGoal = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.deleteGoal(id);
      if (response.success) {
        setGoals(goals.filter(g => g._id !== id));
        return true;
      } else {
        setError(response.error || 'Erro ao deletar meta');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar meta');
      return false;
    } finally {
      setLoading(false);
    }
  }, [goals]);

  // Adicionar pagamento
  const addPayment = useCallback(async (goalId: string, payment: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.addPaymentToGoal(goalId, payment);
      if (response.success) {
        setGoals(goals.map(g => g._id === goalId ? response.data : g));
        return response.data;
      } else {
        setError(response.error || 'Erro ao adicionar pagamento');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar pagamento');
      return null;
    } finally {
      setLoading(false);
    }
  }, [goals]);

  // Obter progresso
  const getProgress = useCallback(async (id: string): Promise<GoalProgress | null> => {
    try {
      const response = await apiService.getGoalProgress(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Erro ao obter progresso');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao obter progresso');
      return null;
    }
  }, []);

  // Buscar metas ao montar o componente
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    fetchGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    addPayment,
    getProgress,
  };
}
