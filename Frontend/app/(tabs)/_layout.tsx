import { View, Text } from "react-native";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

export default function TabsLayout() {
  const router = useRouter();

  /*  useEffect(() => {
    // Redirect to student_tabs when this layout loads
    router.replace("/(tabs)/(tutor_tabs)");
  }, []); */

  return (
    <Stack>
      <Stack.Screen name="(student_tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(tutor_tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="course_details" options={{ headerShown: false }} />
      <Stack.Screen name="(quiz)" options={{ headerShown: false }} />
      <Stack.Screen name="(chatbot)" options={{ headerShown: false }} />
    </Stack>
  );
}
