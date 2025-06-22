import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ProviderKind } from "@/types/accounts";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

interface EmptyStateProps {
	type: ProviderKind;
	message: string;
	className?: string;
}

export function EmptyState({ type, message, className = "" }: EmptyStateProps) {
	const { colorScheme } = useColorScheme();
	const accentColor =
		colorScheme === "dark" ? colors.dark.accent : colors.light.accent;

	return (
		<View className={`items-center justify-center p-6 ${className}`}>
			<ServiceIcon
				type={type}
				size={32}
				color={accentColor}
				className="mb-3 opacity-50"
			/>
			<ThemedText className="text-sm text-center text-muted-foreground">
				{message}
			</ThemedText>
		</View>
	);
}
