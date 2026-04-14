import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export interface GoalCardProps {
  id: string;
  itemName: string;
  totalValue: number;
  savedP1: number;
  savedP2: number;
  nameP1: string;
  nameP2: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export function GoalCard({
  id,
  itemName,
  totalValue,
  savedP1,
  savedP2,
  nameP1,
  nameP2,
  onPress,
  onDelete,
}: GoalCardProps) {
  const colors = useColors();
  const totalSaved = savedP1 + savedP2;
  const progressPercentage = (totalSaved / totalValue) * 100;
  const remaining = totalValue - totalSaved;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className={cn(
          'bg-surface rounded-2xl p-4 mb-4 border',
          'shadow-sm'
        )}
        style={{ borderColor: colors.border }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              {itemName}
            </Text>
            <Text className="text-sm text-muted mt-1">
              R$ {totalSaved.toFixed(2)} de R$ {totalValue.toFixed(2)}
            </Text>
          </View>
          {onDelete && (
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text className="text-error text-lg font-semibold">✕</Text>
            </Pressable>
          )}
        </View>

        {/* Progress Bar */}
        <View
          className="h-2 bg-border rounded-full overflow-hidden mb-3"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-full bg-primary rounded-full"
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>

        {/* Progress Info */}
        <View className="mb-3">
          <Text className="text-xs text-muted mb-2">
            {progressPercentage.toFixed(1)}% concluído
          </Text>
          <Text className="text-xs text-muted">
            Faltam R$ {remaining.toFixed(2)}
          </Text>
        </View>

        {/* Contributors */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">{nameP1}</Text>
            <Text className="text-sm font-semibold text-foreground">
              R$ {savedP1.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">{nameP2}</Text>
            <Text className="text-sm font-semibold text-foreground">
              R$ {savedP2.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
