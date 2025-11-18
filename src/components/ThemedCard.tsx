import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { theme } from "../theme/colors";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export default function ThemedCard({ children, style, padded = true }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderColor: theme.surfaceBorder,
          borderWidth: 1,
          borderRadius: theme.radiusCard,
          padding: padded ? 16 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

