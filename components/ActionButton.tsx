import { ReactNode } from "react";
import { ViewProps, Pressable, ActivityIndicator } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useColorScheme } from "@/lib/useColorScheme";
import * as Haptics from "expo-haptics";

interface ActionButtonProps extends ViewProps {
	label: string;
	loading?: boolean;
	loadingLabel?: string;
	icon?: ReactNode;
	variant?: "primary" | "danger" | "secondary" | "white";
	className?: string;
	onPress?: () => void;
	disabled?: boolean;
	showArrow?: boolean;
}

export function ActionButton({
	label,
	loading,
	loadingLabel = "Processing...",
	icon,
	variant = "primary",
	className = "",
	onPress,
	disabled,
	showArrow,
	...props
}: ActionButtonProps) {
	const { colorScheme } = useColorScheme();

	const handlePress = () => {
		if (disabled || loading) return;

		if (variant === "danger") {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
		} else {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}

		onPress?.();
	};

	const getStyles = () => {
		if (variant === "danger") {
			return {
				container: "bg-destructive",
				text: "text-destructive-foreground",
			};
		} else if (variant === "secondary") {
			return {
				container: "bg-secondary",
				text: "text-secondary-foreground",
			};
		} else if (variant === "white") {
			return {
				container: "bg-white/20",
				text: "text-white",
			};
		}
		return {
			container: "bg-accent",
			text: "text-accent-foreground",
		};
	};

	const styles = getStyles();

	return (
		<Pressable
			onPress={handlePress}
			disabled={disabled || loading}
			style={({ pressed }) => [
				pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
			]}
			className={disabled ? "opacity-50" : ""}
		>
			<ThemedView
				className={`flex-row items-center justify-center p-3 rounded-lg ${styles.container} ${className}`}
				{...props}
			>
				{loading ? (
					<Animated.View entering={FadeIn} className="flex-row items-center">
						<ActivityIndicator
							size="small"
							color={variant === "secondary" ? "hsl(142 43% 50%)" : "white"}
						/>
						<ThemedText className={`ml-2 font-medium ${styles.text}`}>
							{loadingLabel}
						</ThemedText>
					</Animated.View>
				) : (
					<Animated.View entering={FadeIn} className="flex-row items-center">
						{icon}
						<ThemedText
							className={`font-medium ${icon ? "ml-2" : ""} ${styles.text}`}
						>
							{label}
						</ThemedText>
						{showArrow && (
							<ChevronRight
								size={20}
								color={variant === "primary" ? "white" : "hsl(142 43% 50%)"}
								className="ml-2"
							/>
						)}
					</Animated.View>
				)}
			</ThemedView>
		</Pressable>
	);
}
