import React, { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { gradients } from "../theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  title: string;
  onBack?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap; // "arrow-back" | "close" etc
  rightSlot?: ReactNode;
}

export default function ThemedHeader({ title, onBack, leftIcon = "arrow-back", rightSlot }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: insets.top + 6, paddingBottom: 12, paddingHorizontal: 14, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          {onBack ? <Ionicons name={leftIcon} size={24} color="#fff" /> : <View style={{ width: 24 }} />}
        </Pressable>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>{title}</Text>
        <View style={{ minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
          {rightSlot}
        </View>
      </View>
    </LinearGradient>
  );
}

