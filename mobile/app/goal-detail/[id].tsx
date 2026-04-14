import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { fetchGoalById, addPayment, getProgress, loading } = useGoals();

  const [goal, setGoal] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<'P1' | 'P2'>('P1');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadGoalData();
    }
  }, [id]);

  const loadGoalData = async () => {
    if (!id) return;
    const goalData = await fetchGoalById(id);
    if (goalData) {
      setGoal(goalData);
      const progressData = await getProgress(id);
      if (progressData) {
        setProgress(progressData);
      }
    }
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || !goal) return;

    setSubmitting(true);
    const payerId = selectedPayer === 'P1' ? goal.nameP1 : goal.nameP2;
    const result = await addPayment(goal._id, {
      paymentId: `PAY_${Date.now()}`,
      amount: parseFloat(paymentAmount),
      payerId,
    });

    if (result) {
      setPaymentAmount('');
      await loadGoalData();
    }
    setSubmitting(false);
  };

  if (loading && !goal) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-muted mt-2">Carregando...</Text>
      </ScreenContainer>
    );
  }

  if (!goal) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-error">Meta não encontrada</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary text-lg font-semibold">← Voltar</Text>
          </Pressable>
          <Text className="text-3xl font-bold text-foreground mt-2">
            {goal.itemName}
          </Text>
        </View>

        {/* Progress Card */}
        {progress && (
          <View
            className="bg-surface rounded-2xl p-4 mb-6 border"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-sm text-muted mb-2">Progresso</Text>
            <View className="h-3 bg-border rounded-full overflow-hidden mb-3">
              <View
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${progress.progressPercentage}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-lg font-bold text-foreground">
                R$ {progress.totalSaved.toFixed(2)}
              </Text>
              <Text className="text-lg font-bold text-muted">
                {progress.progressPercentage.toFixed(1)}%
              </Text>
            </View>
            <Text className="text-sm text-muted">
              Faltam R$ {(progress.totalValue - progress.totalSaved).toFixed(2)}
            </Text>
          </View>
        )}

        {/* Contributors */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Contribuições
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-lg p-3 border" style={{ borderColor: colors.border }}>
              <Text className="text-xs text-muted mb-1">{goal.nameP1}</Text>
              <Text className="text-xl font-bold text-foreground">
                R$ {goal.savedP1.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-3 border" style={{ borderColor: colors.border }}>
              <Text className="text-xs text-muted mb-1">{goal.nameP2}</Text>
              <Text className="text-xl font-bold text-foreground">
                R$ {goal.savedP2.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Add Payment */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Registrar Pagamento
          </Text>

          {/* Payer Selection */}
          <View className="flex-row gap-2 mb-3">
            {[
              { label: goal.nameP1, value: 'P1' as const },
              { label: goal.nameP2, value: 'P2' as const },
            ].map((payer) => (
              <Pressable
                key={payer.value}
                onPress={() => setSelectedPayer(payer.value)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1"
              >
                <View
                  className={cn(
                    'py-2 px-3 rounded-lg border items-center',
                    selectedPayer === payer.value
                      ? 'bg-primary border-primary'
                      : 'border-border'
                  )}
                  style={{
                    backgroundColor:
                      selectedPayer === payer.value ? colors.primary : 'transparent',
                    borderColor:
                      selectedPayer === payer.value ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className={cn(
                      'font-semibold',
                      selectedPayer === payer.value ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {payer.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Amount Input */}
          <TextInput
            placeholder="Valor (R$)"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="decimal-pad"
            editable={!submitting}
            placeholderTextColor={colors.muted}
            className="border rounded-lg px-3 py-2 text-foreground mb-3"
            style={{
              borderColor: colors.border,
              color: colors.foreground,
            }}
          />

          {/* Submit Button */}
          <Pressable
            onPress={handleAddPayment}
            disabled={submitting || !paymentAmount}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="py-3 rounded-lg items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold">
                {submitting ? 'Registrando...' : 'Registrar Pagamento'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Payments History */}
        {goal.payments && goal.payments.length > 0 && (
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">
              Histórico de Pagamentos
            </Text>
            {goal.payments.map((payment: any, index: number) => (
              <View
                key={index}
                className="bg-surface rounded-lg p-3 mb-2 flex-row justify-between items-center border"
                style={{ borderColor: colors.border }}
              >
                <View>
                  <Text className="text-sm font-semibold text-foreground">
                    {payment.payerId}
                  </Text>
                  <Text className="text-xs text-muted">
                    {new Date(payment.date).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-primary">
                  R$ {payment.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
