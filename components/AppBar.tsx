import { View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { X, ChevronLeft, Search, MoreVertical } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface Action {
	icon: React.ReactNode;
	onPress: () => void;
	label?: string;
}

interface AppBarProps {
	title: string;
	showBack?: boolean;
	onBack?: () => void;
	rightAction?: {
		label?: string;
		icon?: React.ReactNode;
		onPress: () => void;
		disabled?: boolean;
		className?: string;
	};
	actions?: Action[];
	searchable?: boolean;
	onSearch?: (text: string) => void;
	modal?: boolean;
}

export function AppBar({
	title,
	showBack,
	onBack,
	rightAction,
	actions,
	searchable,
	onSearch,
	modal,
}: AppBarProps) {
	const [isSearching, setIsSearching] = useState(false);
	const [searchText, setSearchText] = useState("");
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const iconColor =
		colorScheme === "dark" ? colors.dark.accent : colors.light.accent;

	const handleBack = () => {
		Haptics.selectionAsync();

		if (isSearching) {
			setIsSearching(false);
			setSearchText("");
			onSearch?.("");
			return;
		}
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	const handleSearch = (text: string) => {
		setSearchText(text);
		onSearch?.(text);
	};

	return (
		<Animated.View entering={FadeIn}>
			<SafeAreaView
				edges={["top"]}
				className="border-b bg-card/95 border-border backdrop-blur-lg"
			>
				<View className="flex-row items-center justify-between px-4 py-2">
					<View className="flex items-center justify-center w-9 h-9">
						{(showBack || modal || isSearching) && (
							<Pressable onPress={handleBack} className="active:opacity-70">
								<ThemedView className="flex items-center justify-center rounded-full w-9 h-9 bg-accent/10">
									{modal ? (
										<X size={18} color={iconColor} />
									) : (
										<ChevronLeft size={18} color={iconColor} />
									)}
								</ThemedView>
							</Pressable>
						)}
					</View>

					{isSearching ? (
						<Animated.View entering={SlideInRight} className="flex-1 mx-2">
							<TextInput
								placeholder="Search..."
								value={searchText}
								onChangeText={handleSearch}
								autoFocus
								className="text-base text-foreground"
								placeholderTextColor={
									colorScheme === "dark"
										? colors.dark.mutedForeground
										: colors.light.mutedForeground
								}
							/>
						</Animated.View>
					) : (
						<ThemedText
							type="title"
							className="flex-1 mx-2 font-bold text-center"
						>
							{title}
						</ThemedText>
					)}

					<View className="flex-row items-end justify-end w-16 gap-2">
						{searchable && !isSearching && (
							<Pressable
								onPress={() => {
									Haptics.selectionAsync();
									setIsSearching(true);
								}}
								className="active:opacity-70"
							>
								<ThemedView className="flex items-center justify-center rounded-full w-9 h-9 bg-accent/10">
									<Search size={18} color={iconColor} />
								</ThemedView>
							</Pressable>
						)}

						{actions && actions.length > 0 && !isSearching && (
							<Pressable
								onPress={() => {
									Haptics.selectionAsync();
									/* Show actions menu */
								}}
								className="active:opacity-70"
							>
								<ThemedView className="flex items-center justify-center rounded-full w-9 h-9 bg-accent/10">
									<MoreVertical size={18} color={iconColor} />
								</ThemedView>
							</Pressable>
						)}

						{rightAction && !isSearching && (
							<Pressable
								onPress={() => {
									if (rightAction.disabled) return;
									Haptics.selectionAsync();
									rightAction.onPress();
								}}
								disabled={rightAction.disabled}
								className={`active:opacity-70 ${rightAction.disabled ? "opacity-50" : ""}`}
							>
								{rightAction.icon ? (
									<ThemedView
										className={`flex items-center justify-center w-9 h-9 rounded-full ${rightAction.className ?? "bg-accent/10"}`}
									>
										{rightAction.icon}
									</ThemedView>
								) : (
									<ThemedText
										className={
											rightAction.className ?? "text-accent font-semibold"
										}
									>
										{rightAction.label}
									</ThemedText>
								)}
							</Pressable>
						)}
					</View>
				</View>
			</SafeAreaView>
		</Animated.View>
	);
}
