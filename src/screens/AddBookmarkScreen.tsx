import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../state/authStore";
import { useBookmarkStore } from "../state/bookmarkStore";
import { FunctionsService } from "../services/functionsService";
import { Bookmark } from "../types/bookmark";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../theme/colors";

export default function AddBookmarkScreen({ navigation }: any) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const categories = useBookmarkStore((s) => s.categories);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetched data
  const [metadata, setMetadata] = useState<any>(null);

  // User editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    undefined
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Debounce timer for auto-fetch
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleFetchMetadata = async () => {
    if (!url) {
      setError("กรุณากรอก URL");
      return;
    }

    setLoading(true);
    setError("");
    setMetadata(null);
    setSummary("");

    try {
      const result = await FunctionsService.scrapeAndSummarize(url.trim());
      setMetadata(result);

      setTitle(result.title);
      setDescription(result.description);
      setSummary(result.summary);
    } catch (err) {
      console.error("scrapeAndSummarize error:", err);
      setError("ไม่สามารถดึงข้อมูลจากเว็บไซต์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch metadata when URL changes
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset states if URL is empty
    if (!url.trim()) {
      setMetadata(null);
      setTitle("");
      setDescription("");
      setSummary("");
      setError("");
      return;
    }

    // Check if URL is valid
    const isValidUrl = /^https?:\/\/.+/.test(url.trim());
    if (!isValidUrl) {
      return; // Wait for user to finish typing
    }

    // Debounce: wait 1.5 seconds after user stops typing
    debounceTimer.current = setTimeout(() => {
      handleFetchMetadata();
    }, 1500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveBookmark = () => {
    if (!metadata || !currentUser) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      url: metadata.url,
      title: title,
      description: description,
      summary: summary,
      imageUrl: metadata.imageUrl,
      faviconUrl: metadata.faviconUrl,
      categoryId: selectedCategoryId,
      tags: tags,
      dateAdded: new Date().toISOString(),
      userId: currentUser.id,
    };

    addBookmark(newBookmark);
    navigation.goBack();
  };

  return (
    <ThemedScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ThemedHeader
          title="เพิ่ม Bookmark"
          leftIcon="close"
          onBack={() => navigation.goBack()}
          rightSlot={
            <Pressable
              onPress={handleSaveBookmark}
              disabled={!metadata}
              style={{
                opacity: metadata ? 1 : 0.6,
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
            {/* URL Input */}
            <Text className="text-sm font-medium text-white/80 mb-2">
              URL เว็บไซต์
            </Text>
            <View className="mb-4">
              <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                <Ionicons name="link-outline" size={20} color="#D1D5DB" />
                <TextInput
                  className="flex-1 py-3 px-3 text-base"
                  style={{ color: "#fff" }}
                  placeholder="https://example.com"
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  editable={!loading}
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
                {loading && (
                  <ActivityIndicator color="#ffffff" size="small" />
                )}
              </View>
              {url.trim() && !loading && !metadata && (
                <Text className="text-xs text-white/70 mt-2 ml-1">
                  ระบบจะดึงข้อมูลอัตโนมัติเมื่อคุณพิมพ์ URL เสร็จ...
                </Text>
              )}
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <Text className="text-red-700">{error}</Text>
              </View>
            ) : null}

            {/* Loading State */}
            {loading ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white/80 mt-4">กำลังดึงข้อมูล...</Text>
              </View>
            ) : null}

            {/* Preview and Edit Fields */}
            {metadata && !loading ? (
              <>
                {/* Preview Image */}
                <View className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  {metadata.imageUrl ? (
                    <Image
                      source={{ uri: metadata.imageUrl }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-48 items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                      <Ionicons name="image-outline" size={48} color="#E5E7EB" />
                    </View>
                  )}
                </View>

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
              </>
            ) : null}

            {/* Category Selection */}
            {metadata ? (
              <>
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
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  แท็ก
                </Text>
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
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedScreen>
  );
}
