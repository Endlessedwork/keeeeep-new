import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../state/authStore";
import { useBookmarkStore } from "../state/bookmarkStore";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import FaviconImage from "../components/FaviconImage";
import { brandColors, gradients } from "../theme/colors";

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const currentUser = useAuthStore((s) => s.currentUser);
  
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const categories = useBookmarkStore((s) => s.categories);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Refresh bookmarks when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Force re-render
    }, [])
  );

  // Get all unique tags from user's bookmarks
  const allTags = Array.from(
    new Set(
      bookmarks
        .filter((b) => b.userId === currentUser?.id)
        .flatMap((b) => b.tags)
    )
  );

  const filteredBookmarks = bookmarks
    .filter((bookmark) => {
      const matchesSearch =
        searchQuery === "" ||
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || bookmark.categoryId === selectedCategory;

      return matchesSearch && matchesCategory && bookmark.userId === currentUser?.id;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const getCategoryById = (id?: string) => {
    return categories.find((c) => c.id === id);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1021]" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 170 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 14,
            paddingTop: 10,
            paddingBottom: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <Logo size={40} />
              <View className="ml-3">
                <Text className="text-white/80 text-sm">สวัสดี, {currentUser?.name}</Text>
                <Text className="text-2xl font-bold text-white">Keeeeep</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle sort order"
                onPress={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="rounded-full w-11 h-11 items-center justify-center bg-white/15 mr-2 border border-white/10"
              >
                <Ionicons
                  name={sortOrder === "newest" ? "arrow-down" : "arrow-up"}
                  size={20}
                  color="#fff"
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Manage categories"
                onPress={() => navigation.navigate("ManageCategories")}
                className="rounded-full w-11 h-11 items-center justify-center bg-white/15 mr-2 border border-white/10"
              >
                <Ionicons name="folder-outline" size={22} color="#fff" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                onPress={() => navigation.navigate("Settings")}
                className="rounded-full w-11 h-11 items-center justify-center bg-white/15 border border-white/10"
              >
                <Ionicons name="settings-outline" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Popular Tags */}
          {allTags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-1"
            >
              {allTags.slice(0, 10).map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => setSearchQuery(tag)}
                  className="bg-white/15 border border-white/20 rounded-full px-3 py-1 mr-2"
                >
                  <Text className="text-sm text-white font-medium">#{tag}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </LinearGradient>

        <View className="-mt-4">
          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
          >
            <Pressable
              className={`px-4 py-2 rounded-full mr-3 border ${
                !selectedCategory ? "bg-white border-white/20" : "bg-white/5 border-white/10"
              }`}
              onPress={() => setSelectedCategory(undefined)}
            >
              <Text
                className={`text-sm font-semibold ${
                  !selectedCategory ? "text-brand-primary" : "text-white"
                }`}
              >
                ทั้งหมด
              </Text>
            </Pressable>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                className={`px-4 py-2 rounded-full mr-3 border ${
                  selectedCategory === category.id
                    ? "bg-white border-white/20"
                    : "bg-white/5 border-white/10"
                }`}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === category.id ? "text-brand-primary" : "text-white"
                  }`}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Bookmarks List */}
          {filteredBookmarks.length === 0 ? (
            <View className="items-center justify-center py-20 px-8">
              <View className="bg-white/10 rounded-full p-6 mb-4 border border-white/10">
                  <Ionicons name="bookmark-outline" size={48} color="#E5E7EB" />
                </View>
                <Text className="text-xl font-semibold text-white mb-2">
                ยังไม่มี Bookmark
              </Text>
              <Text className="text-base text-white/70 text-center">
                เริ่มเพิ่มเว็บแรกของคุณด้วยปุ่ม + ด้านล่าง ให้โลโก้ Keeeeep อยู่ทุกที่
              </Text>
            </View>
            ) : (
            <View className="px-4">
              {filteredBookmarks.map((bookmark) => {
                const category = getCategoryById(bookmark.categoryId);
                const detailText = bookmark.summary || bookmark.description || "";
                const truncatedDetail =
                  detailText.length > 140
                    ? detailText.slice(0, 139) + "…"
                    : detailText;
                return (
                  <Pressable
                    key={bookmark.id}
                    className="bg-white/5 border border-white/10 rounded-2xl mb-2.5 p-3.5 active:opacity-70 flex-row relative"
                    onPress={() => Linking.openURL(bookmark.url)}
                  >
                    {/* Favicon Thumbnail */}
                    <View className="mr-3">
                      <FaviconImage uri={bookmark.faviconUrl} size={48} />
                    </View>

                    {/* Content */}
                    <View className="flex-1 pr-8">
                        <View className="flex-row items-start mb-0.5">
                          <Text
                            className="text-base font-semibold text-white"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {bookmark.title}
                          </Text>
                        </View>
                        {category ? (
                          <View className="flex-row items-center mb-0.5">
                            <View
                              className="px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: category.color + "25" }}
                            >
                              <Text
                                className="text-xs font-semibold"
                                style={{ color: category.color }}
                              >
                                {category.name}
                              </Text>
                            </View>
                          </View>
                        ) : null}

                      <Text
                        className="text-sm text-white/70 mb-1"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {truncatedDetail}
                      </Text>

                      {/* Tags */}
                      {bookmark.tags.length > 0 ? (
                        <View className="flex-row flex-wrap mb-2">
                          {bookmark.tags.slice(0, 3).map((tag, index) => (
                            <View
                              key={index}
                              className="bg-white/10 border border-white/10 rounded-full px-2 py-0.5 mr-2 mb-1"
                            >
                              <Text className="text-xs text-white/80">#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null}

                      {/* URL and Date */}
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs text-white/50" numberOfLines={1}>
                          {new URL(bookmark.url).hostname}
                        </Text>
                        <Text className="text-xs text-white/50">
                          {new Date(bookmark.dateAdded).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </View>
                    </View>

                    {/* Info button */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        navigation.navigate("BookmarkDetail", { bookmarkId: bookmark.id });
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel="Bookmark info"
                      className="absolute top-1.5 right-1.5 w-9 h-9 rounded-full items-center justify-center"
                    >
                      <Ionicons name="information-circle-outline" size={20} color="#E5E7EB" />
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Search Bar */}
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 90,
          bottom: insets.bottom + 18,
        }}
      >
        <View className="flex-row items-center bg-white/10 border border-white/15 rounded-2xl px-3.5 py-2.5">
          <Ionicons name="search" size={20} color="#E5E7EB" />
          <TextInput
            className="flex-1 ml-2 text-base text-white"
            placeholder="ค้นหา bookmarks, tags..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#E5E7EB" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Add Button */}
      <Pressable
        className="absolute rounded-full w-16 h-16 items-center justify-center"
        style={{ bottom: insets.bottom + 18, right: 18 }}
        onPress={() => navigation.navigate("AddBookmark")}
      >
        <LinearGradient
          colors={gradients.primary}
              start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </Pressable>
    </SafeAreaView>
  );
}
