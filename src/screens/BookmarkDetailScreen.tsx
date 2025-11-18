import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBookmarkStore } from "../state/bookmarkStore";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import GradientButton from "../components/GradientButton";
import ThemedCard from "../components/ThemedCard";
import { theme } from "../theme/colors";

export default function BookmarkDetailScreen({ route, navigation }: any) {
  const { bookmarkId } = route.params;
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const categories = useBookmarkStore((s) => s.categories);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);

  const bookmark = bookmarks.find((b) => b.id === bookmarkId);
  const category = categories.find((c) => c.id === bookmark?.categoryId);

  if (!bookmark) {
    return (
      <ThemedScreen>
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            ไม่พบ Bookmark
          </Text>
        <View style={{ width: "70%", marginTop: 12 }}>
          <GradientButton title="กลับ" onPress={() => navigation.goBack()} />
        </View>
        </View>
      </ThemedScreen>
    );
  }

  const handleOpenUrl = () => {
    Linking.openURL(bookmark.url);
  };

  const handleDelete = () => {
    removeBookmark(bookmark.id);
    navigation.goBack();
  };

  return (
    <ThemedScreen>
      <ThemedHeader
        title="รายละเอียด"
        onBack={() => navigation.goBack()}
        rightSlot={
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={() => navigation.navigate("EditBookmark", { bookmarkId: bookmark.id })} style={{ padding: 6, marginRight: 2 }}>
              <Ionicons name="create-outline" size={22} color="#fff" />
            </Pressable>
            <Pressable onPress={handleDelete} style={{ padding: 6 }}>
              <Ionicons name="trash-outline" size={22} color="#fff" />
            </Pressable>
          </View>
        }
      />

      <ScrollView className="flex-1">
        {/* Image - Only show if exists */}
        {bookmark.imageUrl && (
          <Image
            source={{ uri: bookmark.imageUrl }}
            className="w-full h-64"
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View className="p-4">
          {/* Title */}
          <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: "800", marginBottom: 12 }}>
            {bookmark.title}
          </Text>

          {/* Category */}
          {category ? (
            <View className="flex-row items-center mb-3">
              <View className="px-3 py-2 rounded-lg" style={{ backgroundColor: category.color + "25" }}>
                <Text className="text-sm font-semibold" style={{ color: category.color }}>
                  {category.name}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Description */}
          {bookmark.description ? (
            <View className="mb-4">
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6 }}>คำอธิบาย</Text>
              <Text style={{ color: theme.textPrimary, opacity: 0.85, fontSize: 16 }}>{bookmark.description}</Text>
            </View>
          ) : null}

          {/* AI Summary */}
          <ThemedCard style={{ marginBottom: 12 }}>
            <View className="flex-row items-center mb-2">
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={{ color: theme.textPrimary, fontWeight: "700", marginLeft: 8 }}>AI สรุป</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>{bookmark.summary}</Text>
          </ThemedCard>

          {/* Tags */}
          {bookmark.tags.length > 0 ? (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-500 mb-2">
                แท็ก
              </Text>
              <View className="flex-row flex-wrap">
                {bookmark.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-2 mr-2 mb-2"
                  >
                    <Text className="text-sm text-gray-700">#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* URL */}
          <View className="mb-4">
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6 }}>URL</Text>
            <ThemedCard padded={true}>
              <Pressable onPress={handleOpenUrl} className="flex-row items-center">
                <Ionicons name="link-outline" size={20} color="#fff" />
                <Text className="flex-1 ml-2" style={{ color: theme.textPrimary }} numberOfLines={2}>
                  {bookmark.url}
                </Text>
                <Ionicons name="open-outline" size={20} color="#fff" />
              </Pressable>
            </ThemedCard>
          </View>

          {/* Date Added */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-500 mb-1">
              วันที่เพิ่ม
            </Text>
            <Text className="text-base text-gray-700">
              {new Date(bookmark.dateAdded).toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Open in Browser Button */}
          <GradientButton title="เปิดในเบราว์เซอร์" onPress={handleOpenUrl} icon="globe-outline" />
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
