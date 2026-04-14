import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useGoals } from '@/hooks/useGoals';
import { ScreenContainer } from '@/components/screen-container';
import { GoalForm, GoalFormData } from '@/components/GoalForm';

export default function CreateGoalScreen() {
  const router = useRouter();
  const { createGoal, loading } = useGoals();

  const handleSubmit = async (data: GoalFormData) => {
    const newGoal = await createGoal({
      itemName: data.itemName,
      totalValue: parseFloat(data.totalValue),
      months: parseInt(data.months),
      contributionP1: parseFloat(data.contributionP1),
      nameP1: data.nameP1,
      nameP2: data.nameP2,
    });

    if (newGoal) {
      router.push('/(tabs)/goals');
    }
  };

  return (
    <ScreenContainer className="p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-foreground">Criar Nova Meta</Text>
        <Text className="text-sm text-muted mt-1">
          Defina uma meta compartilhada com seu parceiro
        </Text>
      </View>

      <GoalForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={loading}
        submitLabel="Criar Meta"
      />
    </ScreenContainer>
  );
}
