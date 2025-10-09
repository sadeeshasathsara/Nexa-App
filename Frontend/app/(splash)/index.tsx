import { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(splash)/onboarding1");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="school" size={80} color="#fff" />
        <Text style={styles.appName}>LearnHub</Text>
        <Text style={styles.tagline}>Learn Without Limits</Text>
      </View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot]} />
          <View style={[styles.dot, styles.dot]} />
          <View style={[styles.dot, styles.dot]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 100,
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginHorizontal: 4,
  },
});
