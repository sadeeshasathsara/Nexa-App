import { Stack } from "expo-router";

export default function QuizLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="generate_quiz" />
      <Stack.Screen name="select_lessons" />
      <Stack.Screen name="quiz_settings" />
      <Stack.Screen name="quiz_preview" />
      <Stack.Screen name="publish_quiz" />
    </Stack>
  );
}