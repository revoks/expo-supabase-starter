import { ScrollView, View, Pressable, Alert, Switch } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
	CreditCard,
	Bell,
	Shield,
	HelpCircle,
	LogOut,
	User,
	Palette,
	Moon,
	Sun,
	Smartphone,
	FileText,
	Settings as SettingsIcon,
} from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AppBar } from "@/components/AppBar";
import { SettingsSection } from "@/components/ui/SettingsSection";
import { SettingsItem } from "@/components/ui/SettingsItem";
import { useAuth } from "@/context/supabase-provider";
import { useAccounts } from "@/context/accounts-context";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
	const { colorScheme } = useColorScheme();
	const accentColor =
		colorScheme === "dark" ? colors.dark.accent : colors.light.accent;
	const { signOut, user } = useAuth();
	const { paySystems } = useAccounts();

	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [hapticFeedback, setHapticFeedback] = useState(true);

	const handleSignOut = () => {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Sign Out",
				style: "destructive",
				onPress: async () => {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
					await signOut();
				},
			},
		]);
	};

	const handleComingSoon = (feature: string) => {
		Alert.alert(
			"Coming Soon",
			`${feature} will be available in the next update`,
		);
	};

	const toggleNotifications = () => {
		const newValue = !notificationsEnabled;
		setNotificationsEnabled(newValue);
		if (hapticFeedback) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}
	};

	const toggleHapticFeedback = () => {
		const newValue = !hapticFeedback;
		setHapticFeedback(newValue);
		if (newValue) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}
	};

	return (
		<ThemedView className="flex-1 bg-background">
			<AppBar title="Settings" />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					padding: 16,
					paddingBottom: 100,
				}}
			>
				<Animated.View entering={FadeIn}>
					{/* Account Section */}
					<SettingsSection
						title="Account"
						description="Manage your account settings and preferences"
					>
						<SettingsItem
							icon={User}
							title="Profile"
							description={user?.email || "Manage your personal information"}
							onPress={() => handleComingSoon("Profile management")}
						/>
					</SettingsSection>

					{/* Payment Settings */}
					<Animated.View entering={FadeInDown.delay(100)}>
						<SettingsSection
							title="Payment"
							description="Configure payment methods and settings"
						>
							<SettingsItem
								icon={CreditCard}
								title="Payment Methods"
								description={`${paySystems.length} payment ${paySystems.length === 1 ? "method" : "methods"} configured`}
								onPress={() => handleComingSoon("Payment methods")}
							/>
							<View className="border-t border-border" />
							<SettingsItem
								icon={Shield}
								title="Payment Security"
								description="Manage security settings for payments"
								onPress={() => handleComingSoon("Payment security")}
							/>
						</SettingsSection>
					</Animated.View>

					{/* Notifications */}
					<Animated.View entering={FadeInDown.delay(200)}>
						<SettingsSection
							title="Notifications"
							description="Control how you receive notifications"
						>
							<SettingsItem
								icon={Bell}
								title="Push Notifications"
								description="Get notified about due bills and payments"
								showArrow={false}
							>
								<Switch
									value={notificationsEnabled}
									onValueChange={toggleNotifications}
									trackColor={{
										false: colors.light.border,
										true: accentColor,
									}}
									thumbColor={
										notificationsEnabled ? "#fff" : colors.light.mutedForeground
									}
								/>
							</SettingsItem>
						</SettingsSection>
					</Animated.View>

					{/* App Preferences */}
					<Animated.View entering={FadeInDown.delay(300)}>
						<SettingsSection
							title="App Preferences"
							description="Customize your app experience"
						>
							<SettingsItem
								icon={colorScheme === "dark" ? Moon : Sun}
								title="Appearance"
								value={colorScheme === "dark" ? "Dark" : "Light"}
								onPress={() => handleComingSoon("Theme settings")}
							/>
							<View className="border-t border-border" />
							<SettingsItem
								icon={Smartphone}
								title="Haptic Feedback"
								description="Feel vibrations when interacting with the app"
								showArrow={false}
							>
								<Switch
									value={hapticFeedback}
									onValueChange={toggleHapticFeedback}
									trackColor={{
										false: colors.light.border,
										true: accentColor,
									}}
									thumbColor={
										hapticFeedback ? "#fff" : colors.light.mutedForeground
									}
								/>
							</SettingsItem>
						</SettingsSection>
					</Animated.View>

					{/* Support & Legal */}
					<Animated.View entering={FadeInDown.delay(400)}>
						<SettingsSection
							title="Support & Legal"
							description="Get help and view legal information"
						>
							<SettingsItem
								icon={HelpCircle}
								title="Help & Support"
								description="Get help with using UtilPay"
								onPress={() => handleComingSoon("Help center")}
							/>
							<View className="border-t border-border" />
							<SettingsItem
								icon={FileText}
								title="Terms of Service"
								onPress={() => handleComingSoon("Terms of service")}
							/>
							<View className="border-t border-border" />
							<SettingsItem
								icon={FileText}
								title="Privacy Policy"
								onPress={() => handleComingSoon("Privacy policy")}
							/>
						</SettingsSection>
					</Animated.View>

					{/* Sign Out */}
					<Animated.View entering={FadeInDown.delay(500)}>
						<SettingsSection title="Account Actions">
							<SettingsItem
								icon={LogOut}
								title="Sign Out"
								description="Sign out and return to the welcome screen"
								onPress={handleSignOut}
								showArrow={false}
							/>
						</SettingsSection>
					</Animated.View>
				</Animated.View>
			</ScrollView>
		</ThemedView>
	);
}
