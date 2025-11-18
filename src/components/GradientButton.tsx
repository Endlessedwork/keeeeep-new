import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, gradients, shadows } from "../theme/colors";

type Variant = "solid" | "outline";

interface GradientButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: Variant;
}

export default function GradientButton({
  title,
  onPress,
  icon,
  loading,
  disabled,
  style,
  variant = "solid",
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={[
          {
            borderColor: brandColors.outline,
            borderWidth: 1,
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.05)",
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={brandColors.primary} />
        ) : (
          <>
            {icon ? (
              <View style={{ marginRight: 8 }}>
                <Ionicons name={icon} size={18} color={brandColors.primary} />
              </View>
            ) : null}
            <Text
              style={{
                color: brandColors.primary,
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={{ width: "100%" }}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            opacity: isDisabled ? 0.7 : 1,
            ...shadows.card,
          },
          style as ViewStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon ? (
              <View style={{ marginRight: 8 }}>
                <Ionicons name={icon} size={18} color="#fff" />
              </View>
            ) : null}
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}
