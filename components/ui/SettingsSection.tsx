import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/ui/Card";

interface SettingsSectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

export function SettingsSection({
	title,
	description,
	children,
	className = "",
}: SettingsSectionProps) {
	return (
		<View className={`mb-6 ${className}`}>
			<View className="mb-4">
				<ThemedText className="text-lg font-semibold mb-1">{title}</ThemedText>
				{description && (
					<ThemedText className="text-sm text-muted-foreground">
						{description}
					</ThemedText>
				)}
			</View>
			<Card variant="elevated" className="overflow-hidden">
				{children}
			</Card>
		</View>
	);
}
