import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../state/authStore";
import { useBookmarkStore } from "../state/bookmarkStore";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import ThemedCard from "../components/ThemedCard";
import { theme } from "../theme/colors";

export default function StatisticsScreen({ navigation }: any) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const categories = useBookmarkStore((s) => s.categories);

  const userBookmarks = useMemo(
    () => bookmarks.filter((b) => b.userId === currentUser?.id),
    [bookmarks, currentUser]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBookmarks = userBookmarks.length;

    // Bookmarks by category
    const byCategory = categories.map((cat) => ({
      ...cat,
      count: userBookmarks.filter((b) => b.categoryId === cat.id).length,
    }));

    // All tags with count
    const tagCounts: { [key: string]: number } = {};
    userBookmarks.forEach((b) => {
      b.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Recent bookmarks
    const recentBookmarks = [...userBookmarks]
      .sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      )
      .slice(0, 5);

    // This week bookmarks
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCount = userBookmarks.filter(
      (b) => new Date(b.dateAdded) > oneWeekAgo
    ).length;

    return {
      totalBookmarks,
      byCategory,
      topTags,
      recentBookmarks,
      thisWeekCount,
      totalTags: Object.keys(tagCounts).length,
      uncategorized: userBookmarks.filter((b) => !b.categoryId).length,
    };
  }, [userBookmarks, categories]);

  return (
    <ThemedScreen>
      <ThemedHeader title="สถิติ" onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1">
        {/* Overview Cards */}
        <View className="p-4">
          <View className="flex-row flex-wrap -mx-2">
            {/* Total Bookmarks */}
            <View className="w-1/2 px-2 mb-4">
              <ThemedCard>
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="bookmark" size={24} color="#fff" />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700" }}>ทั้งหมด</Text>
                </View>
                <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800" }}>{stats.totalBookmarks}</Text>
                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>Bookmarks</Text>
              </ThemedCard>
            </View>

            {/* This Week */}
            <View className="w-1/2 px-2 mb-4">
              <ThemedCard>
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="calendar" size={24} color="#fff" />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700" }}>สัปดาห์นี้</Text>
                </View>
                <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800" }}>{stats.thisWeekCount}</Text>
                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>รายการใหม่</Text>
              </ThemedCard>
            </View>

            {/* Categories */}
            <View className="w-1/2 px-2 mb-4">
              <ThemedCard>
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="folder" size={24} color="#fff" />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700" }}>หมวดหมู่</Text>
                </View>
                <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800" }}>{categories.length}</Text>
                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>หมวดหมู่</Text>
              </ThemedCard>
            </View>

            {/* Tags */}
            <View className="w-1/2 px-2 mb-4">
              <ThemedCard>
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="pricetag" size={24} color="#fff" />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700" }}>แท็ก</Text>
                </View>
                <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800" }}>{stats.totalTags}</Text>
                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>แท็กทั้งหมด</Text>
              </ThemedCard>
            </View>
          </View>
        </View>

        {/* Bookmarks by Category */}
        <ThemedCard style={{ marginHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            จำนวนตามหมวดหมู่
          </Text>
          {stats.byCategory.map((cat) => (
            <View
              key={cat.id}
              className="flex-row items-center justify-between py-3"
              style={{ borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={cat.color}
                  />
                </View>
                <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600" }}>
                  {cat.name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: "800", marginRight: 8 }}>
                  {cat.count}
                </Text>
                <View style={{ width: 64, height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 9999, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: `${stats.totalBookmarks > 0 ? (cat.count / stats.totalBookmarks) * 100 : 0}%`, backgroundColor: cat.color, borderRadius: 9999 }} />
                </View>
              </View>
            </View>
          ))}

          {stats.uncategorized > 0 && (
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-gray-100">
                  <Ionicons name="help-circle" size={20} color="#9CA3AF" />
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 16, fontWeight: "600" }}>
                  ไม่มีหมวดหมู่
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 22, fontWeight: "800" }}>
                {stats.uncategorized}
              </Text>
            </View>
          )}
        </ThemedCard>

        {/* Top Tags */}
        {stats.topTags.length > 0 && (
          <ThemedCard style={{ marginHorizontal: 16, marginBottom: 12 }}>
            <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              แท็กยอดนิยม
            </Text>
            <View className="flex-row flex-wrap">
              {stats.topTags.map((item) => (
                <View
                  key={item.tag}
                  className="flex-row items-center rounded-full px-3 py-2 mr-2 mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}
                >
                  <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}>#{item.tag}</Text>
                  <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 9999, width: 24, height: 24, alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{item.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ThemedCard>
        )}

        {/* Recent Bookmarks */}
        {stats.recentBookmarks.length > 0 && (
          <View className="bg-white p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              เพิ่มล่าสุด
            </Text>
            {stats.recentBookmarks.map((bookmark) => (
              <Pressable
                key={bookmark.id}
                onPress={() =>
                  navigation.navigate("BookmarkDetail", {
                    bookmarkId: bookmark.id,
                  })
                }
                className="flex-row items-center py-3 border-b border-gray-100 active:bg-gray-50"
              >
                <View className="flex-1">
                  <Text
                    className="text-base font-medium text-gray-900"
                    numberOfLines={1}
                  >
                    {bookmark.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {new Date(bookmark.dateAdded).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedScreen>
  );
}
