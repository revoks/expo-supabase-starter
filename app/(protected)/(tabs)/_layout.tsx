import { Tabs } from "expo-router";
import React from "react";
import { Home, Building2, Clock, Settings } from "lucide-react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

export default function TabsLayout() {
	const { colorScheme } = useColorScheme();
	const accentColor =
		colorScheme === "dark" ? colors.dark.accent : colors.light.accent;
	const inactiveColor =
		colorScheme === "dark"
			? colors.dark.mutedForeground
			: colors.light.mutedForeground;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: accentColor,
				tabBarInactiveTintColor: inactiveColor,
				tabBarStyle: {
					position: "absolute",
					borderTopWidth: 0,
					backgroundColor: "transparent",
					height: 85,
					elevation: 0,
				},
				tabBarBackground: () => <TabBarBackground />,
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Home size={24} color={color} />,
					tabBarButton: HapticTab,
				}}
			/>
			<Tabs.Screen
				name="accounts"
				options={{
					title: "Properties",
					tabBarIcon: ({ color }) => <Building2 size={24} color={color} />,
					tabBarButton: HapticTab,
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "History",
					tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
					tabBarButton: HapticTab,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
					tabBarButton: HapticTab,
				}}
			/>
		</Tabs>
	);
}
