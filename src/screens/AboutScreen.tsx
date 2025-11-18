import React from "react";
import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../components/Logo";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import { theme } from "../theme/colors";

export default function AboutScreen({ navigation }: any) {
  const handleEmailPress = () => {
    Linking.openURL("mailto:endlessedwork@gmail.com");
  };

  return (
    <ThemedScreen>
      <ThemedHeader title="เกี่ยวกับ" onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1">
        {/* App Info */}
        <View className="items-center py-8 mb-4">
          <Logo size={100} />
          <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800", marginTop: 12 }}>Keeeeep</Text>
          <Text style={{ color: theme.textSecondary, marginTop: 6 }}>เวอร์ชัน 1.0.0</Text>
        </View>

        {/* Description */}
        <View className="p-4 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderRadius: 16 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            เกี่ยวกับแอป
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 16, lineHeight: 22 }}>
            แอปจัดเก็บและจัดระเบียบเว็บไซต์ที่คุณชื่นชอบ พร้อม AI
            สรุปเนื้อหาอัตโนมัติ ช่วยให้คุณจัดการ bookmarks
            ได้อย่างมีประสิทธิภาพด้วยระบบหมวดหมู่และแท็ก
          </Text>
        </View>

        {/* Features */}
        <View className="p-4 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderRadius: 16 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            ฟีเจอร์หลัก
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                <Ionicons name="bookmark" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600" }}>
                  บันทึก URL อัตโนมัติ
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  ดึงข้อมูล metadata และรูปภาพจากเว็บไซต์
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600" }}>
                  AI สรุปอัจฉริยะ
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  ใช้ AI สรุปเนื้อหาเป็นภาษาไทยอัตโนมัติ
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                <Ionicons name="folder" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600" }}>
                  จัดระเบียบง่าย
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  แบ่งหมวดหมู่และเพิ่มแท็กตามใจชอบ
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                <Ionicons name="search" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600" }}>
                  ค้นหารวดเร็ว
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  ค้นหาด้วยชื่อ, URL, แท็ก และเรียงตามวันที่
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Developer */}
        <View className="p-4 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderRadius: 16 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            นักพัฒนา
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Text className="text-xl font-bold text-white">E</Text>
            </View>
            <View className="flex-1">
              <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600" }}>
                Endlessedwork
              </Text>
              <Pressable onPress={handleEmailPress}>
                <Text style={{ color: theme.textPrimary, fontSize: 13 }}>
                  endlessedwork@gmail.com
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Legal */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            ข้อมูลทางกฎหมาย
          </Text>
          <Text className="text-sm text-gray-600 leading-5">
            © 2025 Keeeeep by Endlessedwork. All rights reserved.
          </Text>
          <Text className="text-sm text-gray-600 leading-5 mt-2">
            แอปนี้พัฒนาโดยใช้ React Native และ Expo
          </Text>
        </View>

        {/* Powered by */}
        <View className="px-4 py-8">
          <Text className="text-center text-sm text-gray-500 mb-2">
            Powered by
          </Text>
          <View className="flex-row items-center justify-center space-x-2">
            <Text className="text-sm font-medium text-gray-700">
              OpenAI GPT-4o
            </Text>
            <Text className="text-gray-400">•</Text>
            <Text className="text-sm font-medium text-gray-700">
              React Native
            </Text>
            <Text className="text-gray-400">•</Text>
            <Text className="text-sm font-medium text-gray-700">Expo</Text>
          </View>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
