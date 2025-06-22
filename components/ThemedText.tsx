import { Text } from 'react-native';
import type { TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  className?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption';
};

export function ThemedText({
  className = '',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const baseStyles = {
    default: 'text-base leading-6 text-foreground',
    defaultSemiBold: 'text-base leading-6 font-semibold text-foreground',
    title: 'text-2xl font-bold leading-8 tracking-tight text-foreground',
    subtitle: 'text-xl font-semibold tracking-tight text-foreground',
    link: 'text-base leading-6 text-accent font-medium',
    caption: 'text-sm leading-5 text-muted-foreground'
  }[type];

  return <Text className={`${baseStyles} ${className}`} {...rest} />;
}