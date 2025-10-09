import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Use setTimeout to ensure navigation happens after mount
    const timer = setTimeout(() => {
      router.replace("/(splash)");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(splash)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
