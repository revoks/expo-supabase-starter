import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Building2, Receipt, Calendar } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { PaymentStatusBadge, PaymentStatus } from '@/components/ui/PaymentStatusBadge';
import { Payment, Bill, ServiceAccount, ProviderKind } from '@/types/accounts';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/lib/useColorScheme';
import * as Haptics from 'expo-haptics';

interface GroupedPayments {
  [key: string]: {
    month: string;
    totalAmount: number;
    payments: Array<Payment & { bill: Bill; serviceAccount: ServiceAccount }>;
  };
}

interface PaymentHistoryListProps {
  payments: Array<Payment & { bill: Bill; serviceAccount: ServiceAccount }>;
  className?: string;
}

export function PaymentHistoryList({ payments, className = '' }: PaymentHistoryListProps) {
  const { colorScheme } = useColorScheme();
  const accentColor = colorScheme === 'dark' ? colors.dark.accent : colors.light.accent;
  const successColor = colorScheme === 'dark' ? '#22c55e' : '#15803d';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentStatus = (payment: Payment): PaymentStatus => {
    if (payment.success === true) return 'paid';
    if (payment.success === false) return 'failed';
    return 'pending';
  };

  const groupedPayments = payments.reduce((acc: GroupedPayments, payment) => {
    const date = new Date(payment.paid_at || payment.bill.due_date);
    const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        totalAmount: 0,
        payments: []
      };
    }
    acc[monthYear].totalAmount += payment.amount;
    acc[monthYear].payments.push(payment);
    return acc;
  }, {});

  const handlePaymentPress = (billId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/bills/${billId}` as const);
  };

  if (payments.length === 0) {
    return (
      <Card variant="elevated" className={`items-center justify-center p-8 ${className}`}>
        <Receipt size={32} color={accentColor} style={{ opacity: 0.5 }} />
        <ThemedText className="mt-4 text-base text-center text-muted-foreground">
          No payment history yet.{'\n'}
          Pay your bills to see them here.
        </ThemedText>
      </Card>
    );
  }

  const totalSpent = Object.values(groupedPayments).reduce(
    (sum, group) => sum + group.totalAmount,
    0
  );

  return (
    <View className={className}>
      {/* Total Spending Summary */}
      <Card variant="elevated" className="mb-6 overflow-hidden">
        <View className="p-4 bg-accent/5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Receipt size={20} color={accentColor} />
              <ThemedText className="ml-2 text-lg font-semibold">
                Total Paid
              </ThemedText>
            </View>
            <ThemedText className="text-xl font-bold text-accent">
              ${totalSpent.toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </Card>

      {/* Payment history grouped by month */}
      {Object.entries(groupedPayments).map(([month, data], index) => (
        <Animated.View
          key={month}
          entering={FadeIn.delay(index * 100)}
          className="mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Calendar size={20} color={accentColor} />
              <ThemedText className="ml-2 text-lg font-semibold">
                {month}
              </ThemedText>
            </View>
            <ThemedText className="text-base font-medium" style={{ color: successColor }}>
              ${data.totalAmount.toFixed(2)}
            </ThemedText>
          </View>
          
          {data.payments.map((payment, paymentIndex) => (
            <Animated.View
              key={payment.id}
              entering={FadeIn.delay(paymentIndex * 50)}
              className="mb-3"
            >
              <Pressable
                onPress={() => handlePaymentPress(payment.bill.id)}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <Card variant="elevated" className="overflow-hidden">
                  {/* Header */}
                  <View className="p-4 bg-accent/5">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="p-2.5 rounded-xl bg-accent/10">
                          <ServiceIcon
                            type={payment.serviceAccount.provider?.kind as ProviderKind}
                            size={20}
                            color={accentColor}
                          />
                        </View>
                        <View className="flex-1 ml-3">
                          <ThemedText className="text-base font-semibold">
                            {payment.serviceAccount.provider?.name || 'Unknown Provider'}
                          </ThemedText>
                          <ThemedText className="text-sm text-muted-foreground">
                            Account {payment.serviceAccount.account_number}
                          </ThemedText>
                        </View>
                      </View>
                      <PaymentStatusBadge status={getPaymentStatus(payment)} />
                    </View>
                  </View>

                  {/* Content */}
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <Building2 size={16} color={accentColor} className="opacity-50" />
                        <ThemedText className="ml-2 text-sm text-muted-foreground">
                          Property ID: {payment.bill.property_id}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Receipt size={16} style={{ color: successColor }} />
                        <ThemedText className="ml-2 text-sm font-medium" style={{ color: successColor }}>
                          Paid on {formatDate(payment.paid_at || payment.bill.due_date)}
                        </ThemedText>
                      </View>
                      <ThemedText className="text-lg font-bold">
                        ${payment.amount.toFixed(2)}
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
      ))}
    </View>
  );
}