import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../state/authStore";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import ThemedCard from "../components/ThemedCard";
import { theme } from "../theme/colors";
import GradientButton from "../components/GradientButton";

export default function SettingsScreen({ navigation }: any) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const changePassword = useAuthStore((s) => s.changePassword);
  const logout = useAuthStore((s) => s.logout);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const result = changePassword(oldPassword, newPassword);

    if (result) {
      setSuccess("เปลี่ยนรหัสผ่านสำเร็จ!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("รหัสผ่านเก่าไม่ถูกต้อง");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ThemedScreen>
      <ThemedHeader title="ตั้งค่า" onBack={() => navigation.goBack()} />

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        {/* User Info */}
        <ThemedCard style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
                {currentUser?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: theme.textPrimary, fontSize: 20, fontWeight: "700" }}>
                {currentUser?.name}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>{currentUser?.email}</Text>
            </View>
          </View>
        </ThemedCard>

        {/* Change Password Section */}
        <ThemedCard style={{ marginBottom: 12 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            เปลี่ยนรหัสผ่าน
          </Text>

          {/* Success Message */}
          {success ? (
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-green-700 ml-2">{success}</Text>
              </View>
            </View>
          ) : null}

          {/* Error Message */}
          {error ? (
            <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.25)", borderWidth: 1 }}>
              <Text style={{ color: "#fecaca" }}>{error}</Text>
            </View>
          ) : null}

          {/* Old Password */}
          <View className="mb-4">
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6 }}>รหัสผ่านเก่า</Text>
            <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
              <Ionicons name="lock-closed-outline" size={20} color="#D1D5DB" />
              <TextInput
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: theme.textPrimary, fontSize: 16 }}
                placeholder="รหัสผ่านปัจจุบัน"
                placeholderTextColor={theme.textMuted}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showPasswords}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6 }}>รหัสผ่านใหม่</Text>
            <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
              <Ionicons name="lock-closed-outline" size={20} color="#D1D5DB" />
              <TextInput
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: theme.textPrimary, fontSize: 16 }}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                placeholderTextColor={theme.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPasswords}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Confirm New Password */}
          <View className="mb-4">
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6 }}>ยืนยันรหัสผ่านใหม่</Text>
            <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
              <Ionicons name="lock-closed-outline" size={20} color="#D1D5DB" />
              <TextInput
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: theme.textPrimary, fontSize: 16 }}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                placeholderTextColor={theme.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPasswords}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Show Password Toggle */}
          <Pressable onPress={() => setShowPasswords(!showPasswords)} className="flex-row items-center mb-4">
            <Ionicons name={showPasswords ? "checkmark-circle" : "ellipse-outline"} size={20} color="#fff" />
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginLeft: 8 }}>แสดงรหัสผ่าน</Text>
          </Pressable>

          {/* Change Password Button */}
          <GradientButton
            title="เปลี่ยนรหัสผ่าน"
            onPress={handleChangePassword}
            loading={loading}
          />
        </ThemedCard>

        {/* App Links */}
        <ThemedCard style={{ marginBottom: 12 }}>
          <Pressable
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
            onPress={() => navigation.navigate("Statistics")}
          >
            <View className="flex-row items-center">
              <Ionicons name="bar-chart" size={24} color="#60A5FA" />
              <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
                สถิติ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <Pressable
            className="flex-row items-center justify-between py-3"
            onPress={() => navigation.navigate("About")}
          >
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={24} color="#9CA3AF" />
              <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
                เกี่ยวกับ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        </ThemedCard>

        {/* Logout Section */}
        <ThemedCard style={{ marginBottom: 20 }}>
          <Pressable
            className="flex-row items-center justify-center bg-red-50 rounded-xl py-3 border border-red-200"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-600 font-semibold text-base ml-2">
              ออกจากระบบ
            </Text>
          </Pressable>
        </ThemedCard>

        {/* App Info */}
        <View style={{ paddingVertical: 28 }}>
          <Text className="text-center text-sm" style={{ color: theme.textMuted }}>
            Keeeeep v1.0.0
          </Text>
          <Text className="text-center text-xs" style={{ color: theme.textMuted, opacity: 0.8, marginTop: 6 }}>
            เก็บบันทึกเว็บไซต์ที่คุณชื่นชอบ
          </Text>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
