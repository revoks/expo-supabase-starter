import { View } from "react-native";
import { CheckCircle, Clock, XCircle } from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export type PaymentStatus = "paid" | "pending" | "failed";

interface PaymentStatusBadgeProps {
	status: PaymentStatus;
	className?: string;
}

export function PaymentStatusBadge({
	status,
	className = "",
}: PaymentStatusBadgeProps) {
	const { colorScheme } = useColorScheme();

	const getStatusConfig = () => {
		switch (status) {
			case "paid":
				return {
					icon: CheckCircle,
					label: "Paid",
					bgColor: "bg-green-100",
					textColor: "text-green-700",
					iconColor: colorScheme === "dark" ? "#22c55e" : "#15803d",
				};
			case "pending":
				return {
					icon: Clock,
					label: "Pending",
					bgColor: "bg-yellow-100",
					textColor: "text-yellow-700",
					iconColor: colorScheme === "dark" ? "#eab308" : "#a16207",
				};
			case "failed":
				return {
					icon: XCircle,
					label: "Failed",
					bgColor: "bg-red-100",
					textColor: "text-red-700",
					iconColor: colorScheme === "dark" ? "#ef4444" : "#dc2626",
				};
			default:
				return {
					icon: Clock,
					label: "Unknown",
					bgColor: "bg-gray-100",
					textColor: "text-gray-700",
					iconColor:
						colorScheme === "dark"
							? colors.dark.mutedForeground
							: colors.light.mutedForeground,
				};
		}
	};

	const config = getStatusConfig();
	const Icon = config.icon;

	return (
		<View
			className={`flex-row items-center px-2 py-1 rounded-full ${config.bgColor} ${className}`}
		>
			<Icon size={12} color={config.iconColor} />
			<ThemedText className={`ml-1 text-xs font-medium ${config.textColor}`}>
				{config.label}
			</ThemedText>
		</View>
	);
}
