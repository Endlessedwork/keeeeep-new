import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore, initializeAuth } from "./src/state/authStore";
import { useBookmarkStore } from "./src/state/bookmarkStore";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import OnboardingScreen from "./src/screens/OnboardingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddBookmarkScreen from "./src/screens/AddBookmarkScreen";
import BookmarkDetailScreen from "./src/screens/BookmarkDetailScreen";
import EditBookmarkScreen from "./src/screens/EditBookmarkScreen";
import ManageCategoriesScreen from "./src/screens/ManageCategoriesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import AboutScreen from "./src/screens/AboutScreen";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

const Stack = createNativeStackNavigator();

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUser = useAuthStore((s) => s.currentUser);
  const authLoading = useAuthStore((s) => s.loading);
  const fetchBookmarks = useBookmarkStore((s) => s.fetchBookmarks);
  const fetchCategories = useBookmarkStore((s) => s.fetchCategories);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize Firebase authentication
    initializeAuth();
    
    checkOnboarding();

    // Set up an interval to check for onboarding completion
    const interval = setInterval(checkOnboarding, 500);

    return () => clearInterval(interval);
  }, []);

  // Ensure bookmarks/categories load even when user is already logged in (e.g. after app refresh)
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchCategories();
      fetchBookmarks();
    }
  }, [isAuthenticated, currentUser, fetchBookmarks, fetchCategories]);

  const checkOnboarding = async () => {
    const seen = await AsyncStorage.getItem("hasSeenOnboarding");
    setHasSeenOnboarding(seen === "true");
  };

  if (hasSeenOnboarding === null || authLoading) {
    return null; // Loading state
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!hasSeenOnboarding ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : !isAuthenticated ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen 
                  name="AddBookmark" 
                  component={AddBookmarkScreen}
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen 
                  name="EditBookmark" 
                  component={EditBookmarkScreen}
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen 
                  name="ManageCategories" 
                  component={ManageCategoriesScreen}
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen}
                />
                <Stack.Screen 
                  name="Statistics" 
                  component={StatisticsScreen}
                />
                <Stack.Screen 
                  name="About" 
                  component={AboutScreen}
                />
                <Stack.Screen 
                  name="BookmarkDetail" 
                  component={BookmarkDetailScreen}
                />
              </>
            )}
          </Stack.Navigator>
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
