import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Course {
  id: number;
  title: string;
  lessons: number;
}

export default function GenerateQuiz() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    { id: 1, title: "Mathematics Basics", lessons: 12 },
    { id: 2, title: "Physics 101", lessons: 8 },
    { id: 3, title: "Chemistry Fundamentals", lessons: 10 },
  ];

  return (
    <LinearGradient colors={["#3b82f6", "#b1c8f6ff", "#3b82f6"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Generate New Quiz</Text>
          <Text style={styles.subtitle}>Select a course to create quiz from</Text>
        </View>

        {/* Course Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Course</Text>
          <View style={styles.coursesList}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseItem,
                  selectedCourse?.id === course.id && styles.courseItemSelected,
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.title}</Text>
                  <Text style={styles.lessonCount}>
                    {course.lessons} lessons available
                  </Text>
                </View>
                {selectedCourse?.id === course.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Questions</Text>
              <TextInput
                style={styles.settingInput}
                placeholder="10"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Duration (min)</Text>
              <TextInput
                style={styles.settingInput}
                placeholder="30"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !selectedCourse && styles.buttonDisabled,
            ]}
            onPress={() => router.push("/(tutor_tabs)/quiz/select_lessons")}
          >
            <Text style={styles.primaryButtonText}>Select Lessons</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Use Template</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    opacity: 0.9,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  coursesList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  courseItemSelected: {
    backgroundColor: "#b3d6fcff",
    borderLeftWidth: 4,
    borderLeftColor: "#1e3a8a",
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  lessonCount: {
    fontSize: 14,
    color: "#64748b",
  },
  settingsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  settingItem: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 8,
    fontWeight: "500",
  },
  settingInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#76a8eaff",
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#1e40af",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});