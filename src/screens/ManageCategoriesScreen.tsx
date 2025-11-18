import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBookmarkStore } from "../state/bookmarkStore";
import { useAuthStore } from "../state/authStore";
import { Category } from "../types/bookmark";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import { theme } from "../theme/colors";

const COLORS = [
  { name: "น้ำเงิน", value: "#3B82F6" },
  { name: "แดง", value: "#EF4444" },
  { name: "เขียว", value: "#10B981" },
  { name: "เหลือง", value: "#F59E0B" },
  { name: "ม่วง", value: "#8B5CF6" },
  { name: "ชมพู", value: "#EC4899" },
  { name: "ส้ม", value: "#F97316" },
  { name: "ฟ้า", value: "#06B6D4" },
];

const ICONS = [
  "folder",
  "briefcase",
  "school",
  "heart",
  "star",
  "home",
  "game-controller",
  "restaurant",
  "cart",
  "airplane",
  "fitness",
  "musical-notes",
];

export default function ManageCategoriesScreen({ navigation }: any) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const categories = useBookmarkStore((s) => s.categories);
  const addCategory = useBookmarkStore((s) => s.addCategory);
  const removeCategory = useBookmarkStore((s) => s.removeCategory);
  const updateCategory = useBookmarkStore((s) => s.updateCategory);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setSelectedColor(COLORS[0].value);
      setSelectedIcon(ICONS[0]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName("");
    setSelectedColor(COLORS[0].value);
    setSelectedIcon(ICONS[0]);
  };

  const handleSave = () => {
    if (!categoryName.trim() || !currentUser) return;

    if (editingCategory) {
      // Update existing category
      updateCategory(editingCategory.id, {
        name: categoryName.trim(),
        color: selectedColor,
        icon: selectedIcon,
      });
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryName.trim(),
        color: selectedColor,
        icon: selectedIcon,
        userId: currentUser.id,
      };
      addCategory(newCategory);
    }

    handleCloseModal();
  };

  const handleDelete = (categoryId: string) => {
    removeCategory(categoryId);
  };

  return (
    <ThemedScreen>
      <ThemedHeader
        title="จัดการหมวดหมู่"
        onBack={() => navigation.goBack()}
        rightSlot={
          <Pressable onPress={() => handleOpenModal()} style={{ backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 }}>
            <View className="flex-row items-center">
              <Ionicons name="add" size={18} color="#fff" />
              <Text className="text-white font-semibold ml-1">เพิ่ม</Text>
            </View>
          </Pressable>
        }
      />

      {/* Categories List */}
      <ScrollView className="flex-1">
        <View className="p-4">
          {categories.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="rounded-full p-6 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <Ionicons name="folder-outline" size={48} color="#E5E7EB" />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">ยังไม่มีหมวดหมู่</Text>
              <Text className="text-base text-white/70 text-center px-8">เริ่มต้นเพิ่มหมวดหมู่แรกของคุณ</Text>
            </View>
          ) : (
            categories.map((category) => (
              <View
                key={category.id}
                className="rounded-2xl p-4 mb-3 flex-row items-center"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1 }}
              >
                {/* Icon */}
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                </View>

                {/* Name and Color */}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-white mb-1">
                    {category.name}
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <Text className="text-sm text-white/70">
                      {COLORS.find((c) => c.value === category.color)?.name ||
                        "สีกำหนดเอง"}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => handleOpenModal(category)}
                    className="p-2"
                  >
                    <Ionicons name="create-outline" size={24} color="#60A5FA" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(category.id)}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView className="flex-1 bg-white">
          <ThemedHeader
            title={editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
            leftIcon="close"
            onBack={handleCloseModal}
            rightSlot={
              <Pressable
                onPress={handleSave}
                disabled={!categoryName.trim()}
                style={{ opacity: categoryName.trim() ? 1 : 0.6, backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)", borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>บันทึก</Text>
              </Pressable>
            }
          />

          <ScrollView className="flex-1">
            <View className="p-4">
              {/* Preview */}
              <View className="items-center mb-6">
                <View
                  className="w-24 h-24 rounded-3xl items-center justify-center mb-3"
                  style={{ backgroundColor: selectedColor + "20" }}
                >
                  <Ionicons
                    name={selectedIcon as any}
                    size={48}
                    color={selectedColor}
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {categoryName || "ชื่อหมวดหมู่"}
                </Text>
              </View>

              {/* Name Input */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  ชื่อหมวดหมู่
                </Text>
                <View className="bg-gray-50 border border-gray-200 rounded-xl px-4">
                  <TextInput
                    className="py-3 text-base text-gray-900"
                    placeholder="กรอกชื่อหมวดหมู่"
                    value={categoryName}
                    onChangeText={setCategoryName}
                  />
                </View>
              </View>

              {/* Color Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-3">
                  เลือกสี
                </Text>
                <View className="flex-row flex-wrap">
                  {COLORS.map((color) => (
                    <Pressable
                      key={color.value}
                      onPress={() => setSelectedColor(color.value)}
                      className="mr-3 mb-3"
                    >
                      <View
                        className={`w-16 h-16 rounded-2xl items-center justify-center ${
                          selectedColor === color.value
                            ? "border-4 border-gray-800"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {selectedColor === color.value ? (
                          <Ionicons name="checkmark" size={32} color="white" />
                        ) : null}
                      </View>
                      <Text className="text-xs text-gray-600 text-center mt-1">
                        {color.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Icon Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-3">
                  เลือกไอคอน
                </Text>
                <View className="flex-row flex-wrap">
                  {ICONS.map((icon) => (
                    <Pressable
                      key={icon}
                      onPress={() => setSelectedIcon(icon)}
                      className="w-16 h-16 rounded-2xl items-center justify-center mr-3 mb-3"
                      style={{
                        backgroundColor:
                          selectedIcon === icon
                            ? "rgba(255,255,255,0.18)"
                            : "rgba(255,255,255,0.06)",
                        borderColor:
                          selectedIcon === icon
                            ? "rgba(255,255,255,0.35)"
                            : "rgba(255,255,255,0.12)",
                        borderWidth: 1,
                      }}
                    >
                      <Ionicons
                        name={icon as any}
                        size={32}
                        color={selectedIcon === icon ? "#FFFFFF" : "#D1D5DB"}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </ThemedScreen>
  );
}
