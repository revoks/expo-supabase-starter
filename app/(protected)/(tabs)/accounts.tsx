import { useState, useEffect, useMemo } from 'react';
import { ScrollView, Pressable, RefreshControl, View } from 'react-native';
import { router, Link } from 'expo-router';
import { Plus, Building2, ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppBar } from '@/components/AppBar';
import { Card } from '@/components/ui/Card';
import { useAccounts } from '@/context/accounts-context';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/lib/useColorScheme';
import { Property, ServiceAccount, ProviderKind } from '@/types/accounts';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { ServiceFilter } from '@/components/ui/ServiceFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import * as Haptics from 'expo-haptics';

const PropertyCard = ({
  property,
  services = [],
  accentColor
}: {
  property: Property,
  services: ServiceAccount[],
  accentColor: string
}) => {
  const getPropertyName = () => {
    if (property.data?.name) return property.data.name;
    return property.address_txt || 'Property';
  };

  const getPropertyAddress = () => {
    return property.address_txt || 'No address';
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Header */}
      <View className="p-4 bg-accent/5">
        <View className="flex-row items-center">
          <View className="p-2.5 rounded-xl bg-accent/10">
            <Building2 size={24} color={accentColor} />
          </View>
          <View className="flex-1 ml-3">
            <ThemedText className="text-lg font-semibold">{getPropertyName()}</ThemedText>
            <ThemedText className="text-sm text-muted-foreground">
              {getPropertyAddress()}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Services Preview */}
        <View className="mb-4">
          {Array.isArray(services) && services.slice(0, 2).map(service => (
            <View
              key={service.id}
              className="flex-row items-center justify-between py-2"
            >
              <View className="flex-row items-center">
                <ServiceIcon
                  type={service.provider?.kind as ProviderKind}
                  size={16}
                  color={accentColor}
                  className="mr-2"
                />
                <ThemedText className="text-sm font-medium">
                  {service.provider?.name || 'Unknown Provider'}
                </ThemedText>
              </View>
              <ThemedText className="text-sm text-muted-foreground">
                {service.account_number}
              </ThemedText>
            </View>
          ))}
          {Array.isArray(services) && services.length > 2 && (
            <ThemedText className="text-xs text-muted-foreground">
              +{services.length - 2} more services
            </ThemedText>
          )}
        </View>

        {/* Action Button */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/properties/${property.id}` as const);
          }}
          style={({ pressed }) => [
            pressed && { opacity: 0.7 }
          ]}
          className="flex-row items-center justify-center p-3 rounded-lg bg-accent"
        >
          <ThemedText className="mr-2 font-medium text-white">View Services</ThemedText>
          <ChevronRight size={20} color="white" />
        </Pressable>
      </View>
    </Card>
  );
};

const PropertiesList = ({
  properties = [],
  getServices,
  accentColor
}: {
  properties: Property[],
  getServices: (id: number) => ServiceAccount[],
  accentColor: string
}) => (
  <View className="gap-4">
    {properties.map((property) => (
      <PropertyCard
        key={property.id}
        property={property}
        services={getServices(property.id)}
        accentColor={accentColor}
      />
    ))}
  </View>
);

export default function AccountsScreen() {
  const { colorScheme } = useColorScheme();
  const accentColor = colorScheme === 'dark' ? colors.dark.accent : colors.light.accent;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<ProviderKind | 'all'>('all');

  const {
    properties = [],
    getPropertyServices
  } = useAccounts();

  useEffect(() => {
    if (properties.length > 0) {
      setError(null);
    }
  }, [properties]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      setError('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredProperties = useMemo(() => {
    if (selectedServiceType === 'all') {
      return properties;
    }
    return properties.filter(property => {
      const services = getPropertyServices(property.id);
      return services.some(service => service.provider?.kind === selectedServiceType);
    });
  }, [properties, selectedServiceType, getPropertyServices]);

  const allServiceCounts = useMemo(() => {
    const counts = new Map<ProviderKind, number>();
    properties.forEach(property => {
      const services = getPropertyServices(property.id);
      services.forEach(service => {
        if (service.provider?.kind) {
          const currentCount = counts.get(service.provider.kind) || 0;
          counts.set(service.provider.kind, currentCount + 1);
        }
      });
    });
    return counts;
  }, [properties, getPropertyServices]);

  if (error) {
    return (
      <ThemedView className="flex-1 bg-background">
        <AppBar title="Properties" />
        <View className="items-center justify-center flex-1 p-4">
          <ThemedText className="mb-4 text-center text-destructive">
            {error}
          </ThemedText>
          <Pressable onPress={handleRefresh}>
            <Card variant="subtle" className="p-4">
              <ThemedText className="text-accent">
                Try Again
              </ThemedText>
            </Card>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-background">
      <AppBar title="Properties" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={accentColor}
          />
        }
      >
        <Animated.View entering={FadeIn}>
          {/* Properties Section */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-xl font-semibold">Your Properties</ThemedText>
              <Link href="/properties/add" asChild>
                <Pressable
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.7 }
                  ]}
                  className="flex-row items-center p-2 rounded-full bg-accent/10"
                >
                  <Plus size={20} color={accentColor} />
                  <ThemedText className="ml-1 text-sm font-medium text-accent">
                    Add
                  </ThemedText>
                </Pressable>
              </Link>
            </View>

            {properties.length > 0 && (
              <ServiceFilter
                selectedType={selectedServiceType}
                onSelectType={setSelectedServiceType}
                counts={allServiceCounts}
                className="mb-4"
              />
            )}

            {properties.length === 0 ? (
              <Card variant="elevated" className="items-center justify-center p-8 mb-8">
                <Building2 size={32} color={accentColor} style={{ opacity: 0.5 }} />
                <ThemedText className="mt-4 text-base text-center text-muted-foreground">
                  No properties added yet.{'\n'}
                  Add your first property to get started.
                </ThemedText>
              </Card>
            ) : filteredProperties.length === 0 ? (
              <Card variant="elevated" className="items-center justify-center p-8 mb-8">
                <EmptyState
                  type={selectedServiceType as ProviderKind}
                  message={`No properties with ${selectedServiceType} services found.\nAdd a new service to a property.`}
                />
              </Card>
            ) : (
              <View className="mb-8">
                <PropertiesList
                  properties={filteredProperties}
                  getServices={getPropertyServices}
                  accentColor={accentColor}
                />
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}