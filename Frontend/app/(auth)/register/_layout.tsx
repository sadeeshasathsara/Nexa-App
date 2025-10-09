import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="account-setup" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="student" />
      <Stack.Screen name="tutor" />
    </Stack>
  );
}
