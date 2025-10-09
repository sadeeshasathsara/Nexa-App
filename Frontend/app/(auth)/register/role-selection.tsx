import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleStudentSelection = () => {
    // Store role selection and navigate to account setup
    router.push({
      pathname: "/(auth)/register/account-setup",
      params: { role: "student" },
    });
  };

  const handleTutorSelection = () => {
    // Store role selection and navigate to account setup
    router.push({
      pathname: "/(auth)/register/account-setup",
      params: { role: "tutor" },
    });
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How would you like to use LearnHub?</Text>

        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={handleStudentSelection}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="school" size={40} color="#667eea" />
            </View>
            <Text style={styles.roleTitle}>Student</Text>
            <Text style={styles.roleDescription}>
              I want to learn from expert tutors and achieve my academic goals
            </Text>
            <Text style={styles.chooseText}>Select Student →</Text>
          </TouchableOpacity>

          {/* Tutor Card */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={handleTutorSelection}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={40} color="#667eea" />
            </View>
            <Text style={styles.roleTitle}>Tutor</Text>
            <Text style={styles.roleDescription}>
              I want to share my knowledge and help students succeed
            </Text>
            <Text style={styles.chooseText}>Select Tutor →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 40,
  },
  cardsContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  chooseText: {
    textAlign: "center",
    color: "#667eea",
    fontWeight: "600",
    fontSize: 14,
  },
  loginLink: {
    marginTop: 30,
    alignItems: "center",
  },
  loginText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  loginBold: {
    color: "#fff",
    fontWeight: "bold",
  },
});
