import { View } from 'react-native';
import { useColorScheme } from '@/lib/useColorScheme';

export default function TabBarBackground() {
  const { colorScheme } = useColorScheme();
  
  return (
    <View 
      className={`absolute inset-0 ${
        colorScheme === 'dark' 
          ? 'bg-card/95 border-t border-border' 
          : 'bg-card/95 border-t border-border'
      }`}
    />
  );
}