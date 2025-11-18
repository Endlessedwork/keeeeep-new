import React from "react";
import { Image, View } from "react-native";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 40 }: LogoProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}
