import React, { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme/colors";

interface Props {
  children: ReactNode;
}

export default function ThemedScreen({ children }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
