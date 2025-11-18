import React, { useState } from "react";
import { View, Image, ImageStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FaviconImageProps {
  uri?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function FaviconImage({ uri, size = 48, style }: FaviconImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!uri || imageError) {
    // Default fallback icon
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.167,
            backgroundColor: "#6366F1",
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <Ionicons name="globe-outline" size={size * 0.5} color="white" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.167,
        },
        style,
      ]}
      resizeMode="cover"
      onError={() => setImageError(true)}
    />
  );
}
