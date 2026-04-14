import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGoals } from '@/hooks/useGoals';
import { ScreenContainer } from '@/components/screen-container';
import { GoalCard } from '@/components/GoalCard';
import { useColors } from '@/hooks/use-colors';

export default function GoalsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { goals, loading, error, deleteGoal, fetchGoals } = useGoals();

  const handleDeleteGoal = async (id: string) => {
    const success = await deleteGoal(id);
    if (success) {
      // Recarregar lista
      await fetchGoals();
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-foreground">Metas</Text>
            <Text className="text-sm text-muted mt-1">
              {goals.length} meta{goals.length !== 1 ? 's' : ''} ativa{goals.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/create-goal')}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-2xl font-bold">+</Text>
            </View>
          </Pressable>
        </View>

        {/* Loading State */}
        {loading && !goals.length && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-muted mt-2">Carregando metas...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="bg-error/10 border border-error rounded-lg p-4 mb-4">
            <Text className="text-error font-semibold">Erro</Text>
            <Text className="text-error text-sm mt-1">{error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && goals.length === 0 && (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-4xl mb-4">🎯</Text>
            <Text className="text-xl font-semibold text-foreground mb-2">
              Nenhuma meta criada
            </Text>
            <Text className="text-muted text-center mb-6">
              Comece a economizar criando sua primeira meta compartilhada
            </Text>
            <Pressable
              onPress={() => router.push('/create-goal')}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className="px-6 py-3 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white font-semibold">Criar Primeira Meta</Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Goals List */}
        {goals.length > 0 && (
          <View>
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                id={goal._id}
                itemName={goal.itemName}
                totalValue={goal.totalValue}
                savedP1={goal.savedP1}
                savedP2={goal.savedP2}
                nameP1={goal.nameP1}
                nameP2={goal.nameP2}
                onPress={() => router.push(`/goal-detail/${goal._id}`)}
                onDelete={() => handleDeleteGoal(goal._id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
