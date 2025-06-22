import { forwardRef } from "react";
import { View, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import type { ViewProps } from "react-native";

interface CardProps extends ViewProps {
	variant?: "default" | "elevated" | "glass" | "subtle";
	onPress?: () => void;
	animated?: boolean;
	className?: string;
	disabled?: boolean;
}

export const Card = forwardRef<View, CardProps>(
	(
		{
			children,
			variant = "default",
			onPress,
			animated = true,
			className = "",
			disabled = false,
			...rest
		},
		ref,
	) => {
		const baseStyles = {
			default: "bg-card rounded-lg",
			elevated: "bg-card rounded-lg shadow-sm border border-border",
			glass: "bg-card/80 backdrop-blur-lg rounded-lg border border-border/50",
			subtle: "bg-muted/50 rounded-lg",
		}[variant];

		const Wrapper = onPress ? Pressable : View;
		const Component = animated ? Animated.View : View;
		const animatedProps = animated ? { entering: FadeIn } : {};

		return (
			<Wrapper
				onPress={onPress}
				disabled={disabled}
				className={`${disabled ? "opacity-50" : ""} active:opacity-90`}
			>
				<Component
					ref={ref}
					className={`${baseStyles} ${className}`}
					{...animatedProps}
					{...rest}
				>
					{children}
				</Component>
			</Wrapper>
		);
	},
);

Card.displayName = "Card";

interface CardHeaderProps extends ViewProps {
	className?: string;
}

export function CardHeader({
	children,
	className = "",
	...rest
}: CardHeaderProps) {
	return (
		<ThemedView className={`p-4 border-b border-border ${className}`} {...rest}>
			{children}
		</ThemedView>
	);
}

interface CardContentProps extends ViewProps {
	className?: string;
}

export function CardContent({
	children,
	className = "",
	...rest
}: CardContentProps) {
	return (
		<ThemedView className={`p-4 ${className}`} {...rest}>
			{children}
		</ThemedView>
	);
}

interface CardFooterProps extends ViewProps {
	className?: string;
}

export function CardFooter({
	children,
	className = "",
	...rest
}: CardFooterProps) {
	return (
		<ThemedView className={`p-4 border-t border-border ${className}`} {...rest}>
			{children}
		</ThemedView>
	);
}
