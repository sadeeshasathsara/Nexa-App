import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen4() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(auth)/register/role-selection");
  };

  return (
    <LinearGradient colors={["#42e695", "#3bb2b8"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Icon/Graphic */}
        <View style={styles.iconContainer}>
          <Ionicons name="rocket" size={80} color="#fff" />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Ready to Start?</Text>
          <Text style={styles.subtitle}>
            Join thousands of students and tutors already transforming their
            learning and teaching experiences with Nexa.
          </Text>
        </View>

        {/* Final Features */}
        <View style={styles.finalFeatures}>
          <View style={styles.featureColumn}>
            <View style={styles.featureIcon}>
              <Ionicons name="time" size={24} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Flexible</Text>
            <Text style={styles.featureDesc}>Learn at your own pace</Text>
          </View>

          <View style={styles.featureColumn}>
            <View style={styles.featureIcon}>
              <Ionicons name="trophy" size={24} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Quality</Text>
            <Text style={styles.featureDesc}>Expert verified tutors</Text>
          </View>

          <View style={styles.featureColumn}>
            <View style={styles.featureIcon}>
              <Ionicons name="stats-chart" size={24} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Progress</Text>
            <Text style={styles.featureDesc}>Track your improvement</Text>
          </View>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#42e695" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 60,
    justifyContent: "space-between",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  finalFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  featureColumn: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featureDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 20,
  },
  getStartedButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: "#42e695",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});
