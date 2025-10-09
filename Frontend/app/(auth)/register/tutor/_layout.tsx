import { Stack } from "expo-router";

export default function TutorRegistrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="qualifications" />
      <Stack.Screen name="availability" />
    </Stack>
  );
}
