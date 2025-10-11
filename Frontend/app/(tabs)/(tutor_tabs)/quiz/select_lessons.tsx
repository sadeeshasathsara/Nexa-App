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

export default function SelectLessons() {
  const router = useRouter();
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [additionalMaterials, setAdditionalMaterials] = useState("");

  const lessons = [
    { id: "1", title: "Introduction to Algebra", duration: "45 min" },
    { id: "2", title: "Linear Equations", duration: "60 min" },
    { id: "3", title: "Quadratic Functions", duration: "50 min" },
    { id: "4", title: "Polynomials", duration: "55 min" },
    { id: "5", title: "Graphing Basics", duration: "40 min" },
  ];

  const toggleLesson = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  return (
    <LinearGradient colors={["#b1c8f6ff", "#508ff4c6", "#1e3a8a", "#0b63f1c6"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Lessons</Text>
          <Text style={styles.subtitle}>
            Choose lessons to include in your quiz
          </Text>
        </View>

        {/* Lessons List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Lessons (5)</Text>
          <View style={styles.lessonsList}>
            {lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonItem,
                  selectedLessons.includes(lesson.id) && styles.lessonSelected,
                ]}
                onPress={() => toggleLesson(lesson.id)}
              >
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                </View>
                {selectedLessons.includes(lesson.id) ? (
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                ) : (
                  <View style={styles.checkbox} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Materials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Materials</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Paste additional content, notes, or upload documents..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={additionalMaterials}
            onChangeText={setAdditionalMaterials}
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload" size={20} color="#3b82f6" />
            <Text style={styles.uploadButtonText}>Upload Documents</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              selectedLessons.length === 0 && styles.buttonDisabled,
            ]}
            onPress={() => router.push("/(tutor_tabs)/quiz/quiz_settings")}
          >
            <Text style={styles.primaryButtonText}>Configure Settings</Text>
            <Ionicons name="settings" size={20} color="#041a3cff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
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
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#1e3a8a",
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
  lessonsList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lessonSelected: {
    backgroundColor: "#f8fafc",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: "#64748b",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#041a3cff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});