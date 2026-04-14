import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export interface GoalFormData {
  itemName: string;
  totalValue: string;
  months: string;
  contributionP1: string;
  nameP1: string;
  nameP2: string;
}

export interface GoalFormProps {
  initialData?: GoalFormData;
  onSubmit: (data: GoalFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function GoalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Criar Meta',
}: GoalFormProps) {
  const colors = useColors();
  const [formData, setFormData] = useState<GoalFormData>(
    initialData || {
      itemName: '',
      totalValue: '',
      months: '',
      contributionP1: '',
      nameP1: '',
      nameP2: '',
    }
  );
  const [errors, setErrors] = useState<Partial<GoalFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<GoalFormData> = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Nome do item é obrigatório';
    }
    if (!formData.totalValue || parseFloat(formData.totalValue) <= 0) {
      newErrors.totalValue = 'Valor total deve ser maior que 0';
    }
    if (!formData.months || parseInt(formData.months) <= 0) {
      newErrors.months = 'Número de meses deve ser maior que 0';
    }
    if (!formData.contributionP1 || parseFloat(formData.contributionP1) <= 0) {
      newErrors.contributionP1 = 'Contribuição deve ser maior que 0';
    }
    if (!formData.nameP1.trim()) {
      newErrors.nameP1 = 'Nome da pessoa 1 é obrigatório';
    }
    if (!formData.nameP2.trim()) {
      newErrors.nameP2 = 'Nome da pessoa 2 é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof GoalFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const FormField = ({
    label,
    field,
    placeholder,
    keyboardType = 'default',
    error,
  }: {
    label: string;
    field: keyof GoalFormData;
    placeholder: string;
    keyboardType?: 'default' | 'decimal-pad' | 'numeric';
    error?: string;
  }) => (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-2">
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleChange(field, value)}
        keyboardType={keyboardType}
        editable={!isLoading}
        placeholderTextColor={colors.muted}
        className={cn(
          'border rounded-lg px-3 py-2 text-foreground',
          error ? 'border-error' : 'border-border'
        )}
        style={{
          borderColor: error ? colors.error : colors.border,
          color: colors.foreground,
        }}
      />
      {error && (
        <Text className="text-xs text-error mt-1">{error}</Text>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <FormField
          label="Nome do Item"
          field="itemName"
          placeholder="Ex: Viagem, Carro, Casa"
          error={errors.itemName}
        />

        <FormField
          label="Valor Total (R$)"
          field="totalValue"
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.totalValue}
        />

        <FormField
          label="Meses para Economizar"
          field="months"
          placeholder="12"
          keyboardType="numeric"
          error={errors.months}
        />

        <FormField
          label="Contribuição Mensal Pessoa 1 (R$)"
          field="contributionP1"
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.contributionP1}
        />

        <FormField
          label="Nome da Pessoa 1"
          field="nameP1"
          placeholder="Ex: João"
          error={errors.nameP1}
        />

        <FormField
          label="Nome da Pessoa 2"
          field="nameP2"
          placeholder="Ex: Maria"
          error={errors.nameP2}
        />

        {/* Buttons */}
        <View className="flex-row gap-3 mt-6">
          {onCancel && (
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 },
              ]}
              className="flex-1"
            >
              <View
                className="py-3 rounded-lg items-center border"
                style={{ borderColor: colors.border }}
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </View>
            </Pressable>
          )}
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
            ]}
            className="flex-1"
          >
            <View className="py-3 rounded-lg items-center bg-primary">
              <Text className="text-white font-semibold">
                {isLoading ? 'Carregando...' : submitLabel}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
