import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../state/authStore";
import Logo from "../components/Logo";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import GradientButton from "../components/GradientButton";
import { theme } from "../theme/colors";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPassword = useAuthStore((s) => s.resetPassword);

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = resetPassword(email, newPassword);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        setError("ไม่พบอีเมลนี้ในระบบ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedScreen>
      <ThemedHeader title="ลืมรหัสผ่าน" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-6 pb-10">
            {/* Logo */}
            <View className="items-center mb-8">
              <Logo size={80} />
              <Text className="text-3xl font-bold text-white mt-4">
                ลืมรหัสผ่าน
              </Text>
              <Text className="text-base text-white/70 mt-2 text-center">
                ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ
              </Text>
            </View>

            {/* Success Message */}
            {success ? (
              <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text className="text-green-700 ml-2 flex-1">
                    เปลี่ยนรหัสผ่านสำเร็จ! กำลังนำคุณไปหน้าเข้าสู่ระบบ...
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <Text className="text-red-700 text-center">{error}</Text>
              </View>
            ) : null}

            {!success && (
              <>
                {/* Email Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-white/80 mb-2">
                    อีเมล
                  </Text>
                  <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                    <Ionicons name="mail-outline" size={20} color="#D1D5DB" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base"
                      style={{ color: "#fff" }}
                      placeholder="example@email.com"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* New Password Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-white/80 mb-2">
                    รหัสผ่านใหม่
                  </Text>
                  <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#D1D5DB" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base"
                      style={{ color: "#fff" }}
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#D1D5DB" />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-white/80 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </Text>
                  <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1 }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#D1D5DB" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base"
                      style={{ color: "#fff" }}
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Reset Button */}
                <GradientButton
                  title="ตั้งรหัสผ่านใหม่"
                  onPress={handleResetPassword}
                  loading={loading}
                />
              </>
            )}

            {/* Back to Login */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600 text-base">จำรหัสผ่านได้แล้ว? </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>เข้าสู่ระบบ</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedScreen>
  );
}
