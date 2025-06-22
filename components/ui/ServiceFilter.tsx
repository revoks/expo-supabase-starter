import { useRef } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { ProviderKind, PROVIDER_KINDS } from '@/types/accounts';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/lib/useColorScheme';
import * as Haptics from 'expo-haptics';

interface ServiceFilterProps {
   selectedType: ProviderKind | 'all';
   onSelectType: (type: ProviderKind | 'all') => void;
   counts: Map<ProviderKind, number>;
   className?: string;
}

export function ServiceFilter({
   selectedType,
   onSelectType,
   counts,
   className = ''
}: ServiceFilterProps) {
   const scrollRef = useRef<ScrollView>(null);
   const { colorScheme } = useColorScheme();
   const accentColor = colorScheme === 'dark' ? colors.dark.accent : colors.light.accent;

   const handleSelectType = (type: ProviderKind | 'all') => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectType(type);
   };

   const getTotalCount = () => {
      let total = 0;
      counts.forEach(count => total += count);
      return total;
   };

   return (
      <ScrollView
         ref={scrollRef}
         horizontal
         showsHorizontalScrollIndicator={false}
         className={`-mx-4 px-4 ${className}`}
      >
         <View className="flex-row gap-2">
            {PROVIDER_KINDS.map((service) => {
               const count = service.type === 'all' ? getTotalCount() : (counts.get(service.type as ProviderKind) || 0);
               if (count === 0 && service.type !== 'all') return null;

               return (
                  <Pressable
                     key={service.type}
                     onPress={() => handleSelectType(service.type)}
                     style={({ pressed }) => [
                        pressed && { opacity: 0.7 }
                     ]}
                  >
                     <View className={`flex-row items-center px-3 py-2 rounded-xl border ${selectedType === service.type
                           ? 'bg-accent/10 border-accent'
                           : 'border-border'
                        }`}>
                        {service.type !== 'all' && (
                           <ServiceIcon
                              type={service.type as ProviderKind}
                              size={16}
                              color={selectedType === service.type ? accentColor : colors.light.mutedForeground}
                              className="mr-2"
                           />
                        )}
                        <ThemedText className={`${selectedType === service.type
                              ? 'text-accent font-medium'
                              : 'text-muted-foreground'
                           }`}>
                           {service.label} ({count})
                        </ThemedText>
                     </View>
                  </Pressable>
               );
            })}
         </View>
      </ScrollView>
   );
}