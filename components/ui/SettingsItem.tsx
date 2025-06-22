import { Pressable, View } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import * as Haptics from "expo-haptics";

interface SettingsItemProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	value?: string;
	onPress?: () => void;
	showArrow?: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export function SettingsItem({
	icon: Icon,
	title,
	description,
	value,
	onPress,
	showArrow = true,
	children,
	className = "",
	disabled = false,
}: SettingsItemProps) {
	const { colorScheme } = useColorScheme();
	const accentColor =
		colorScheme === "dark" ? colors.dark.accent : colors.light.accent;

	const handlePress = () => {
		if (disabled || !onPress) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onPress();
	};

	const content = (
		<View
			className={`flex-row items-center p-4 ${!onPress && !children ? "" : "min-h-[56px]"} ${className}`}
		>
			{Icon && (
				<View className="mr-3">
					<Icon
						size={20}
						color={disabled ? colors.light.mutedForeground : accentColor}
					/>
				</View>
			)}

			<View className="flex-1">
				<ThemedText
					className={`text-base font-medium ${disabled ? "text-muted-foreground" : ""}`}
				>
					{title}
				</ThemedText>
				{description && (
					<ThemedText className="text-sm text-muted-foreground mt-1">
						{description}
					</ThemedText>
				)}
				{children && <View className="mt-2">{children}</View>}
			</View>

			{value && (
				<ThemedText className="text-sm text-muted-foreground mr-2">
					{value}
				</ThemedText>
			)}

			{showArrow && onPress && (
				<ChevronRight
					size={20}
					color={
						disabled
							? colors.light.mutedForeground
							: colors.light.mutedForeground
					}
				/>
			)}
		</View>
	);

	if (onPress && !disabled) {
		return (
			<Pressable
				onPress={handlePress}
				style={({ pressed }) => [pressed && { opacity: 0.7 }]}
			>
				{content}
			</Pressable>
		);
	}

	return content;
}
