import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBookmarkStore } from "../state/bookmarkStore";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../theme/colors";
import GradientButton from "../components/GradientButton";

export default function EditBookmarkScreen({ route, navigation }: any) {
  const { bookmarkId } = route.params;
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const categories = useBookmarkStore((s) => s.categories);
  const updateBookmark = useBookmarkStore((s) => s.updateBookmark);

  const bookmark = bookmarks.find((b) => b.id === bookmarkId);

  const [title, setTitle] = useState(bookmark?.title || "");
  const [description, setDescription] = useState(bookmark?.description || "");
  const [summary, setSummary] = useState(bookmark?.summary || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    bookmark?.categoryId
  );
  const [tags, setTags] = useState<string[]>(bookmark?.tags || []);
  const [tagInput, setTagInput] = useState("");

  if (!bookmark) {
    return (
      <ThemedScreen>
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-white mt-4">ไม่พบ Bookmark</Text>
          <View style={{ width: "70%", marginTop: 12 }}>
            <GradientButton title="กลับ" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ThemedScreen>
    );
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    updateBookmark(bookmarkId, {
      title,
      description,
      summary,
      categoryId: selectedCategoryId,
      tags,
    });
    navigation.goBack();
  };

  return (
    <ThemedScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ThemedHeader
          title="แก้ไข Bookmark"
          leftIcon="close"
          onBack={() => navigation.goBack()}
          rightSlot={
            <Pressable
              onPress={handleSave}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderColor: "rgba(255,255,255,0.2)",
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>บันทึก</Text>
            </Pressable>
          }
        />

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="p-4">
            {/* Preview Image */}
            {bookmark.imageUrl ? (
              <View className="mb-4 rounded-2xl overflow-hidden">
                <Image
                  source={{ uri: bookmark.imageUrl }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              </View>
            ) : null}

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-white/80 mb-2">
                ชื่อ
              </Text>
              <View className="rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                <TextInput
                  className="py-3 text-base"
                  style={{ color: "#fff" }}
                  placeholder="ชื่อ bookmark"
                  value={title}
                  onChangeText={setTitle}
                  multiline
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
              </View>
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-white/80 mb-2">
                คำอธิบาย
              </Text>
              <View className="rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                <TextInput
                  className="py-3 text-base"
                  style={{ color: "#fff" }}
                  placeholder="คำอธิบาย"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
              </View>
            </View>

            {/* Summary Input */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                <Text className="text-sm font-medium text-white/80 ml-1">
                  AI สรุป
                </Text>
              </View>
              <View className="rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                <TextInput
                  className="py-3 text-base"
                  style={{ color: "#fff" }}
                  placeholder="สรุปเนื้อหา"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={summary}
                  onChangeText={setSummary}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Category Selection */}
            <Text className="text-sm font-medium text-white/80 mb-2">
              หมวดหมู่
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              <Pressable
                className={`px-4 py-2 rounded-xl mr-2 border ${
                  !selectedCategoryId ? "bg-white border-white/20" : "bg-white/5 border-white/10"
                }`}
                onPress={() => setSelectedCategoryId(undefined)}
              >
                <Text
                  className={`font-medium ${
                    !selectedCategoryId ? "text-brand-primary" : "text-white"
                  }`}
                >
                  ไม่มี
                </Text>
              </Pressable>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  className={`px-4 py-2 rounded-xl mr-2 border ${
                    selectedCategoryId === category.id
                      ? "bg-white border-white/20"
                      : "bg-white/5 border-white/10"
                  }`}
                  onPress={() => setSelectedCategoryId(category.id)}
                >
                  <Text
                    className={`font-medium ${
                      selectedCategoryId === category.id ? "text-brand-primary" : "text-white"
                    }`}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Tags */}
            <Text className="text-sm font-medium text-gray-700 mb-2">แท็ก</Text>
            <View className="flex-row items-center mb-2">
              <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 mr-2">
                <Ionicons name="pricetag-outline" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 py-3 px-3 text-base text-gray-900"
                  placeholder="เพิ่มแท็ก..."
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
              </View>
              <Pressable onPress={handleAddTag} style={{ borderRadius: 12, overflow: "hidden" }}>
                <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 }}>
                  <Ionicons name="add" size={24} color="#fff" />
                </LinearGradient>
              </Pressable>
            </View>

            {/* Tags List */}
            {tags.length > 0 ? (
              <View className="flex-row flex-wrap mb-6">
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    className="rounded-full flex-row items-center px-3 py-2 mr-2 mb-2"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}
                  >
                    <Text className="mr-2" style={{ color: "#fff" }}>#{tag}</Text>
                    <Pressable onPress={() => handleRemoveTag(tag)}>
                      <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            {/* URL (Read-only) */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                URL (ไม่สามารถแก้ไขได้)
              </Text>
              <View className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
                <Text className="text-sm text-gray-600" numberOfLines={2}>
                  {bookmark.url}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedScreen>
  );
}
