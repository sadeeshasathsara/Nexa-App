import { Stack } from "expo-router";

export default function StudentRegistrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="education-info" />
      <Stack.Screen name="subjects-selection" />
    </Stack>
  );
}
