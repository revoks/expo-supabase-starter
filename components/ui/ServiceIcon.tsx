import {
	Zap,
	Droplets,
	Flame,
	Wifi,
	Thermometer,
	HelpCircle,
} from "lucide-react-native";
import { View } from "react-native";
import { ProviderKind } from "@/types/accounts";

interface ServiceIconProps {
	type: ProviderKind;
	size?: number;
	color: string;
	className?: string;
}

export function ServiceIcon({
	type,
	size = 24,
	color,
	className = "",
}: ServiceIconProps) {
	const getIcon = () => {
		switch (type) {
			case "electricity":
				return <Zap size={size} color={color} />;
			case "water":
				return <Droplets size={size} color={color} />;
			case "gas":
				return <Flame size={size} color={color} />;
			case "internet":
				return <Wifi size={size} color={color} />;
			case "heating":
				return <Thermometer size={size} color={color} />;
			default:
				return <HelpCircle size={size} color={color} />;
		}
	};

	return <View className={className}>{getIcon()}</View>;
}
