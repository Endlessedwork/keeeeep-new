import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Logo from "../components/Logo";
import GradientButton from "../components/GradientButton";
import { brandColors, gradients } from "../theme/colors";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    icon: "bookmark" as const,
    color: brandColors.primary,
    title: "เก็บบันทึกเว็บไซต์",
    description:
      "บันทึก URL ที่คุณชอบ ระบบดึงข้อมูล ปก และ favicon ให้อัตโนมัติในไม่กี่วินาที",
  },
  {
    id: 2,
    icon: "sparkles" as const,
    color: brandColors.pink,
    title: "AI สรุปอัจฉริยะ",
    description:
      "ปล่อย AI สรุปบทความเป็นภาษาไทย สั้น กระชับ พร้อมไฮไลต์สำคัญให้คุณทันที",
  },
  {
    id: 3,
    icon: "folder" as const,
    color: brandColors.accent,
    title: "จัดระเบียบง่าย",
    description:
      "สร้างหมวดหมู่และแท็กเพื่อค้นหาเร็ว จัดระเบียบแบบสีสันเหมือนโลโก้ Keeeeep",
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(
      event.nativeEvent.contentOffset.x / slideSize
    );
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    // The App.tsx will automatically switch to Login screen
    // when it detects the state change
  };

  return (
    <LinearGradient colors={gradients.primary} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />
        <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
          <View className="flex-row items-center space-x-2">
            <Logo size={38} />
            <Text className="text-white/90 text-xl font-semibold">Keeeeep</Text>
          </View>
          {currentIndex < slides.length - 1 && (
            <Pressable
              onPress={handleSkip}
              className="rounded-full px-4 py-1.5 bg-white/10 border border-white/15"
            >
              <Text className="text-white font-semibold">ข้าม</Text>
            </Pressable>
          )}
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ marginTop: 8 }}
        >
          {slides.map((slide) => (
            <View
              key={slide.id}
              style={{ width }}
              className="flex-1 px-5 justify-center"
            >
              <View className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <View
                  className="w-20 h-20 rounded-2xl items-center justify-center mb-5"
                  style={{
                    backgroundColor: slide.color + "22",
                  }}
                >
                  <Ionicons name={slide.icon} size={44} color={slide.color} />
                </View>
                <Text className="text-3xl font-bold text-white mb-2">
                  {slide.title}
                </Text>
                <Text className="text-base text-white/80 leading-6">
                  {slide.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View className="px-5 pb-8 pt-5">
          {/* Pagination Dots */}
          <View className="flex-row items-center justify-center mb-5">
            {slides.map((_, index) => (
              <View
                key={index}
                className="mx-1 rounded-full"
                style={{
                  width: currentIndex === index ? 28 : 10,
                  height: 10,
                  backgroundColor:
                    currentIndex === index ? brandColors.accent : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </View>

          {/* Next/Get Started Button */}
          <GradientButton
            title={currentIndex === slides.length - 1 ? "เริ่มต้นใช้งาน" : "ถัดไป"}
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
