import React, { useState, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../state/authStore";
import { useBookmarkStore } from "../state/bookmarkStore";
import Logo from "../components/Logo";
import GradientButton from "../components/GradientButton";
import { gradients } from "../theme/colors";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, loginWithGoogle, currentUser, isAuthenticated } = useAuthStore();
  const { initializeUserData } = useBookmarkStore();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Initialize user data when authenticated
      initializeUserData();
    }
  }, [isAuthenticated, currentUser]);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await register(email, password, name);
      if (!success) {
        setError("อีเมลนี้มีผู้ใช้งานแล้ว");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const success = await loginWithGoogle();
      if (!success) {
        setError("สมัครสมาชิกด้วย Google ไม่สำเร็จ");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <LinearGradient colors={gradients.primary} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-5 py-6">
              {/* Header */}
              <View className="items-center mb-7">
                <View className="w-18 h-18 rounded-3xl bg-white/10 border border-white/20 items-center justify-center">
                  <Logo size={68} />
                </View>
                <Text className="text-3xl font-bold text-white mt-3">
                  สมัครสมาชิก
                </Text>
                <Text className="text-base text-white/80 mt-1.5 text-center">
                  เติมสีโลโก้ Keeeeep ให้กับพื้นที่เซฟเว็บของคุณ
                </Text>
              </View>

              <View className="bg-white rounded-3xl p-5 border border-white/30 shadow-lg">
                {/* Error Message */}
                {error ? (
                  <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <Text className="text-red-700 text-center">{error}</Text>
                  </View>
                ) : null}

                {/* Google Sign-In Button */}
                <Pressable
                  className={`bg-white border border-gray-200 rounded-xl py-4 items-center mb-3 flex-row justify-center ${
                    googleLoading ? "opacity-60" : ""
                  }`}
                  onPress={handleGoogleRegister}
                  disabled={googleLoading || loading}
                >
                  {googleLoading ? (
                    <ActivityIndicator color="#4285F4" />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={20} color="#4285F4" />
                      <Text className="text-gray-800 font-semibold text-base ml-2">
                        สมัครสมาชิกด้วย Google
                      </Text>
                    </>
                  )}
                </Pressable>

                {/* Divider */}
                <View className="flex-row items-center my-3">
                  <View className="flex-1 h-px bg-gray-200" />
                  <Text className="mx-4 text-gray-500">หรือ</Text>
                  <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Name Input */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-800 mb-1.5">
                    ชื่อ
                  </Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base text-gray-900"
                      placeholder="ชื่อของคุณ"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      editable={!loading && !googleLoading}
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-800 mb-1.5">
                    อีเมล
                  </Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base text-gray-900"
                      placeholder="example@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading && !googleLoading}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-800 mb-1.5">
                    รหัสผ่าน
                  </Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                    <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base text-gray-900"
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading && !googleLoading}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#9CA3AF"
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-800 mb-1.5">
                    ยืนยันรหัสผ่าน
                  </Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                    <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 py-4 px-3 text-base text-gray-900"
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading && !googleLoading}
                    />
                  </View>
                </View>

                {/* Register Button */}
                <GradientButton
                  title="สมัครสมาชิก"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={googleLoading}
                />

                {/* Login Link */}
                <View className="flex-row justify-center mt-6">
                  <Text className="text-gray-600 text-base">
                    มีบัญชีแล้ว?{" "}
                  </Text>
                  <Pressable onPress={() => navigation.navigate("Login")}>
                    <Text className="text-brand-primary font-semibold text-base">
                      เข้าสู่ระบบ
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
