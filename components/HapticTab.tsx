import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export function HapticTab(props: BottomTabBarButtonProps) {
	return (
		<Pressable
			{...props}
			className={`flex-1 items-center justify-center py-2 ${props.accessibilityState?.selected ? "opacity-100" : "opacity-50"}`}
			onPress={(e) => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				props.onPress?.(e);
			}}
		/>
	);
}
