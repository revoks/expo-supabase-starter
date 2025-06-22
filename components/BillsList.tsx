import { View, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { DollarSign, Building2, Calendar, AlertTriangle, Clock } from 'lucide-react-native';
import Animated, { FadeIn, ZoomIn, Layout } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Card } from '@/components/ui/Card';
import { ActionButton } from '@/components/ActionButton';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/lib/useColorScheme';
import type { Bill } from '@/types/accounts';
import { getDaysUntilDue, formatDate } from '@/utils/date';
import * as Haptics from 'expo-haptics';

interface BillsListProps {
  bills: Bill[];
  isLoading: boolean;
  showPayButton?: boolean;
  onPayBill?: (billId: number) => Promise<void>;
}

export default function BillsList({ bills, isLoading, showPayButton = true }: BillsListProps) {
  const { colorScheme } = useColorScheme();
  const accentColor = colorScheme === 'dark' ? colors.dark.accent : colors.light.accent;
  const warningColor = colorScheme === 'dark' ? colors.dark.warning : colors.light.warning;
  const errorColor = colorScheme === 'dark' ? colors.dark.destructive : colors.light.destructive;

  const formatBillDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const handleBillPress = (billId: number) => {
    const bill = bills.find(b => b.id === billId);
    if (bill && bill.due_date) {
      const daysUntilDue = getDaysUntilDue(bill.due_date);
      if (daysUntilDue < 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (daysUntilDue <= 3) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    
    router.push({
      pathname: "/bills/[id]",
      params: { id: String(billId) }
    });
  };

  const handlePayPress = (billId: number) => {
    const bill = bills.find(b => b.id === billId);
    if (bill && bill.due_date) {
      const daysUntilDue = getDaysUntilDue(bill.due_date);
      if (daysUntilDue < 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    
    router.push({
      pathname: "/bills/pay",
      params: { billId: String(billId) }
    });
  };

  if (isLoading) {
    return (
      <Animated.View 
        entering={FadeIn} 
        className="items-center justify-center p-8"
      >
        <ActivityIndicator size="large" color={accentColor} />
        <ThemedText className="mt-4 text-muted-foreground">
          Loading bills...
        </ThemedText>
      </Animated.View>
    );
  }

  if (bills.length === 0) {
    return (
      <Animated.View 
        entering={FadeIn}
        className="items-center justify-center p-8"
      >
        <Animated.View 
          entering={ZoomIn.delay(300)}
          className="p-4 mb-4 rounded-full bg-accent/10"
        >
          <DollarSign size={32} color={accentColor} />
        </Animated.View>
        <ThemedText className="text-base text-center text-muted-foreground">
          No bills due at the moment.{'\n'}
          Check back later for new bills.
        </ThemedText>
      </Animated.View>
    );
  }

  return (
    <View className="p-4">
      {bills.map((bill, index) => {
        const daysUntilDue = bill.due_date ? getDaysUntilDue(bill.due_date) : 0;
        const isUrgent = daysUntilDue <= 3 && daysUntilDue > 0;
        const isOverdue = daysUntilDue < 0;
        const providerName = bill.service_account?.provider?.title || 'Unknown Provider';

        return (
          <Animated.View
            key={bill.id}
            entering={FadeIn.delay(index * 100)}
            layout={Layout.springify()}
            className="mb-3"
          >
            <Pressable
              onPress={() => handleBillPress(bill.id)}
              style={({ pressed }) => [
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
            >
              <Card variant="elevated" className="overflow-hidden">
                {/* Header */}
                <Animated.View 
                  className={`p-4 ${
                    isOverdue 
                      ? 'bg-destructive/5'
                      : isUrgent
                        ? 'bg-warning/5'
                        : 'bg-accent/5'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Animated.View 
                      className={`p-2.5 rounded-xl ${
                        isOverdue 
                          ? 'bg-destructive/10'
                          : isUrgent
                            ? 'bg-warning/10'
                            : 'bg-accent/10'
                      }`}
                    >
                      {isOverdue ? (
                        <AlertTriangle size={24} color={errorColor} />
                      ) : isUrgent ? (
                        <Clock size={24} color={warningColor} />
                      ) : (
                        <Calendar size={24} color={accentColor} />
                      )}
                    </Animated.View>
                    <View className="flex-1 ml-3">
                      <ThemedText className="text-lg font-semibold">
                        {providerName}
                      </ThemedText>
                      <ThemedText className="text-sm text-muted-foreground">
                        Due {bill.due_date ? formatBillDate(bill.due_date) : 'No due date'}
                      </ThemedText>
                    </View>
                  </View>
                </Animated.View>

                {/* Content */}
                <View className="p-4">
                  <View className="mb-4">
                    <View className="flex-row items-center justify-between py-2">
                      <View className="flex-row items-center">
                        <Building2 size={16} color={accentColor} className="mr-2 opacity-50" />
                        <ThemedText className="text-sm text-muted-foreground">
                          {bill.service_account?.description || 'Service account'}
                        </ThemedText>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between py-2">
                      <View className="flex-row items-center">
                        <Animated.View>
                          {isOverdue ? (
                            <ThemedText className="text-sm font-medium text-destructive">
                              Overdue by {Math.abs(daysUntilDue)} days
                            </ThemedText>
                          ) : (
                            <ThemedText className={`text-sm font-medium ${
                              isUrgent 
                                ? 'text-warning'
                                : 'text-muted-foreground'
                            }`}>
                              Due in {daysUntilDue} days
                            </ThemedText>
                          )}
                        </Animated.View>
                      </View>
                      <ThemedText className="text-base font-bold">
                        ${bill.amount.toFixed(2)}
                      </ThemedText>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    {showPayButton && (
                      <View className="flex-1">
                        <ActionButton
                          onPress={() => handlePayPress(bill.id)}
                          label="Pay Now"
                          variant={isOverdue ? 'danger' : 'primary'}
                          icon={<DollarSign size={20} color="white" />}
                        />
                      </View>
                    )}
                    <View className="flex-1">
                      <ActionButton
                        onPress={() => handleBillPress(bill.id)}
                        label="View Details"
                        showArrow
                        variant="secondary"
                      />
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}