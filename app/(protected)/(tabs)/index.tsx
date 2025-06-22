import { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppBar } from '@/components/AppBar';
import { ActionButton } from '@/components/ActionButton';
import BillsList from '@/components/BillsList';
import { useAccounts } from '@/context/accounts-context';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/lib/useColorScheme';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? colors.dark.accent : colors.light.accent;
  const { getPendingBills, payAllBills, getTotalDebt } = useAccounts();
  const [isLoading, setIsLoading] = useState(true);
  const [isPayingAll, setIsPayingAll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const pendingBills = getPendingBills();
  const totalDue = getTotalDebt();

  const handlePayAll = async () => {
    try {
      setIsPayingAll(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await payAllBills();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to pay all bills:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsPayingAll(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-background">
      <AppBar title="New Bills" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80 // Space for tab bar
        }}
      >
        <Animated.View
          entering={FadeIn}
          className="px-4 pt-4"
        >
          {/* Total Balance Due card */}
          <ThemedView
            variant="elevated"
            className="overflow-hidden rounded-lg shadow-sm border border-border"
            style={{ backgroundColor: 'hsl(142 43% 50%)' }}
          >
            <View className="p-6">
              <ThemedText className="mb-2 text-xl text-white">Total Balance Due</ThemedText>
              <ThemedText className="mb-4 text-3xl font-bold text-white">
                ${totalDue.toFixed(2)}
              </ThemedText>
              <ThemedView className="mb-4">
                <ThemedView className="flex-row items-center justify-between">
                  <ThemedView className="flex-row items-center">
                    <TrendingUp size={16} color="white" />
                    <ThemedText className="ml-1 text-base text-white/90">
                      {pendingBills.length} pending bills
                    </ThemedText>
                  </ThemedView>
                  <ThemedText className="text-base text-white/80">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Pay All Button */}
              {pendingBills.length > 0 && (
                <ActionButton
                  label="Pay All Bills"
                  onPress={handlePayAll}
                  disabled={isPayingAll}
                  loading={isPayingAll}
                  loadingLabel="Processing payments..."
                  icon={<DollarSign size={20} color="white" />}
                  variant="white"
                  className="mt-2 shadow-sm bg-white/25"
                />
              )}
            </View>
          </ThemedView>

          {/* Pending Bills Section */}
          {pendingBills.length > 0 ? (
            <Animated.View
              entering={FadeIn}
              className="mt-6"
            >
              <ThemedView
                variant="elevated"
                className="overflow-hidden rounded-lg shadow-sm border border-border"
              >
                <View className="flex-row items-center justify-between p-4 border-b border-border">
                  <View className="flex-row items-center">
                    <Calendar size={20} color={iconColor} className="mr-2" />
                    <ThemedText className="text-lg font-semibold">Pending Bills</ThemedText>
                  </View>
                  <ThemedText className="text-base font-medium text-accent">
                    ${totalDue.toFixed(2)}
                  </ThemedText>
                </View>
                <BillsList
                  bills={pendingBills}
                  isLoading={isLoading}
                  showPayButton={true}
                />
              </ThemedView>
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeIn}
              className="mt-6"
            >
              <ThemedView
                variant="elevated"
                className="overflow-hidden rounded-lg shadow-sm border border-border"
              >
                <View className="items-center justify-center px-6 py-8">
                  <ThemedText className="text-lg font-semibold">No Pending Bills</ThemedText>
                  <ThemedText className="mt-2 text-base text-center text-muted-foreground">
                    You have no pending bills at the moment.
                  </ThemedText>
                </View>
              </ThemedView>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}