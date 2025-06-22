import { View } from "react-native";
import type { ViewProps } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface ThemedViewProps extends ViewProps {
	className?: string;
	variant?: "default" | "elevated" | "subtle" | "card" | "glass";
	animated?: boolean;
}

export function ThemedView({
	className = "",
	variant = "default",
	animated = false,
	...rest
}: ThemedViewProps) {
	const baseStyles = {
		default: "",
		elevated: "bg-card shadow-sm border border-border",
		subtle: "bg-muted/50",
		card: "bg-card border border-border rounded-lg",
		glass: "bg-card/80 backdrop-blur-lg border border-border/50",
	}[variant];

	const Component = animated ? Animated.View : View;
	const animatedProps = animated ? { entering: FadeIn } : {};

	return (
		<Component
			className={`${baseStyles} ${className}`}
			{...animatedProps}
			{...rest}
		/>
	);
}
