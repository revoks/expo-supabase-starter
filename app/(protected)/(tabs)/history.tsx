import { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Pressable, RefreshControl } from 'react-native';
import { Receipt, Filter, TrendingUp } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppBar } from '@/components/AppBar';
import { Card } from '@/components/ui/Card';
import { PaymentHistoryList } from '@/components/ui/PaymentHistoryList';
import { PaymentStatus, PaymentStatusBadge } from '@/components/ui/PaymentStatusBadge';
import { useAccounts } from '@/context/accounts-context';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/lib/useColorScheme';
import { Payment, Bill, ServiceAccount } from '@/types/accounts';
import * as Haptics from 'expo-haptics';

type PaymentFilter = PaymentStatus | 'all';

export default function HistoryScreen() {
  const { colorScheme } = useColorScheme();
  const accentColor = colorScheme === 'dark' ? colors.dark.accent : colors.light.accent;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilter>('all');
  
  const {
    payments = [],
    bills = [],
    serviceAccounts = []
  } = useAccounts();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getPaymentStatus = (payment: Payment): PaymentStatus => {
    if (payment.success === true) return 'paid';
    if (payment.success === false) return 'failed';
    return 'pending';
  };

  const enhancedPayments = useMemo(() => {
    return payments.map(payment => {
      const bill = bills.find(b => b.id === payment.bill_id);
      const serviceAccount = serviceAccounts.find(sa => sa.id === bill?.service_account_id);
      
      return {
        ...payment,
        bill: bill!,
        serviceAccount: serviceAccount!
      };
    }).filter(p => p.bill && p.serviceAccount);
  }, [payments, bills, serviceAccounts]);

  const filteredPayments = useMemo(() => {
    if (selectedFilter === 'all') {
      return enhancedPayments;
    }
    return enhancedPayments.filter(payment => 
      getPaymentStatus(payment) === selectedFilter
    );
  }, [enhancedPayments, selectedFilter]);

  const paymentCounts = useMemo(() => {
    const counts = { all: 0, paid: 0, pending: 0, failed: 0 };
    enhancedPayments.forEach(payment => {
      counts.all++;
      const status = getPaymentStatus(payment);
      counts[status]++;
    });
    return counts;
  }, [enhancedPayments]);

  const handleFilterPress = (filter: PaymentFilter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filter);
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 bg-background">
        <AppBar title="Payment History" />
        <View className="items-center justify-center flex-1">
          <Receipt size={32} color={accentColor} style={{ opacity: 0.5 }} />
          <ThemedText className="mt-4 text-base text-center text-muted-foreground">
            Loading payment history...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-background">
      <AppBar title="Payment History" />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={accentColor}
          />
        }
        contentContainerStyle={{
          paddingBottom: 100
        }}
      >
        <View className="p-4">
          {enhancedPayments.length === 0 ? (
            <Animated.View entering={FadeIn}>
              <Card variant="elevated" className="items-center justify-center p-8">
                <Receipt size={32} color={accentColor} style={{ opacity: 0.5 }} />
                <ThemedText className="mt-4 text-base text-center text-muted-foreground">
                  No payment history yet.{'\n'}
                  Pay your bills to see them here.
                </ThemedText>
              </Card>
            </Animated.View>
          ) : (
            <>
              {/* Statistics Card */}
              <Animated.View
                entering={FadeInDown.delay(100)}
                className="mb-6"
              >
                <Card variant="elevated" className="overflow-hidden">
                  <View className="p-4 bg-accent/5">
                    <View className="flex-row items-center mb-4">
                      <TrendingUp size={20} color={accentColor} />
                      <ThemedText className="ml-2 text-lg font-semibold">
                        Payment Summary
                      </ThemedText>
                    </View>
                    <View className="flex-row justify-between">
                      <View className="items-center">
                        <ThemedText className="text-2xl font-bold text-accent">
                          {paymentCounts.paid}
                        </ThemedText>
                        <ThemedText className="text-sm text-muted-foreground">Paid</ThemedText>
                      </View>
                      <View className="items-center">
                        <ThemedText className="text-2xl font-bold text-yellow-500">
                          {paymentCounts.pending}
                        </ThemedText>
                        <ThemedText className="text-sm text-muted-foreground">Pending</ThemedText>
                      </View>
                      <View className="items-center">
                        <ThemedText className="text-2xl font-bold text-red-500">
                          {paymentCounts.failed}
                        </ThemedText>
                        <ThemedText className="text-sm text-muted-foreground">Failed</ThemedText>
                      </View>
                    </View>
                  </View>
                </Card>
              </Animated.View>

              {/* Filter Section */}
              <Animated.View
                entering={FadeInDown.delay(200)}
                className="mb-6"
              >
                <View className="flex-row items-center mb-4">
                  <Filter size={20} color={accentColor} />
                  <ThemedText className="ml-2 text-base font-medium">Filter by Status</ThemedText>
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="-mx-4 px-4"
                >
                  <View className="flex-row gap-2">
                    {(['all', 'paid', 'pending', 'failed'] as PaymentFilter[]).map((filter) => (
                      <Pressable
                        key={filter}
                        onPress={() => handleFilterPress(filter)}
                        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                      >
                        <View className={`flex-row items-center px-3 py-2 rounded-xl border ${
                          selectedFilter === filter
                            ? 'bg-accent/10 border-accent'
                            : 'border-border'
                        }`}>
                          {filter !== 'all' && (
                            <PaymentStatusBadge status={filter as PaymentStatus} className="mr-2" />
                          )}
                          <ThemedText className={`${
                            selectedFilter === filter
                              ? 'text-accent font-medium'
                              : 'text-muted-foreground'
                          }`}>
                            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} ({
                              filter === 'all' ? paymentCounts.all : paymentCounts[filter as PaymentStatus]
                            })
                          </ThemedText>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </Animated.View>

              {/* Payment History List */}
              <Animated.View entering={FadeInDown.delay(300)}>
                <PaymentHistoryList payments={filteredPayments} />
              </Animated.View>
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}