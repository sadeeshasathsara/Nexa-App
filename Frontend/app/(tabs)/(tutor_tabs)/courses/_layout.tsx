import { Stack } from "expo-router";

export default function CoursesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="course_list" />
      <Stack.Screen name="course_detail" />
    </Stack>
  );
}