// app/(tabs)/(quiz)/_layout.tsx
import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function QuizLayout() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Generate Quiz",
          }}
        />
        <Stack.Screen
          name="review"
          options={{
            title: "Review Quiz",
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="publish"
          options={{
            title: "publish Quiz",
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
