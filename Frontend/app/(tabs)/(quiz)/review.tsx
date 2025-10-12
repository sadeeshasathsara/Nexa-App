import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ReviewQuiz() {
  const router = useRouter();
  const quizData = [
    {
      id: 1,
      question: "What is the value of x in the equation 2x + 5 = 13?",
      options: ["x = 6", "x = 8", "x = 4", "x = 9"],
      answer: "x = 4",
    },
    {
      id: 2,
      question: "What is the area of a circle with radius 5 units?",
      options: [
        "15π square units",
        "25π square units",
        "10π square units",
        "5π square units",
      ],
      answer: "25π square units",
    },
    {
      id: 3,
      question: "Which of the following is a prime number?",
      options: ["15", "21", "17", "25"],
      answer: "17",
    },
    {
      id: 4,
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      answer: "12",
    },
    {
      id: 5,
      question:
        "If a triangle has angles of 60°, 60°, and 60°, what type of triangle is it?",
      options: [
        "Right triangle",
        "Isosceles triangle",
        "Equilateral triangle",
        "Scalene triangle",
      ],
      answer: "Equilateral triangle",
    },
  ];

  const handlePublish = () => {
    router.push("/(quiz)/publish");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Info */}
        <View style={styles.header}>
          <Text style={styles.title}>Mathematics Quiz</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Draft</Text>
          </View>
          <Text style={styles.subtitle}>
            Basic algebra and geometry concepts
          </Text>
          <Text style={styles.meta}>⏱ 15 minutes • 📘 10 questions</Text>
        </View>

        {/* Questions */}
        {quizData.map((q, i) => (
          <View key={q.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Question {i + 1}</Text>
              <TouchableOpacity>
                <Ionicons name="pencil-outline" size={18} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.questionText}>{q.question}</Text>

            {q.options.map((option, index) => {
              const isCorrect = option === q.answer;
              return (
                <View
                  key={index}
                  style={[styles.option, isCorrect && styles.optionSelected]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isCorrect && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}

        {/* Bottom Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.regenButton}>
            <Ionicons name="refresh" size={18} color="#000" />
            <Text style={styles.regenText}> Regenerate Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
          >
            <Text style={styles.publishText}>Publish Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  badge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  badgeText: { color: "#007AFF", fontWeight: "500" },
  subtitle: { color: "#666", fontSize: 15, marginTop: 4 },
  meta: { color: "#888", fontSize: 14, marginTop: 4 },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  questionNumber: {
    color: "#007AFF",
    fontWeight: "600",
  },
  questionText: {
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 12,
  },
  option: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#e7f5ff",
    borderColor: "#007AFF",
  },
  optionText: { color: "#333" },
  optionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  footer: {
    marginTop: 10,
    gap: 12,
  },
  regenButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 8,
  },
  regenText: { fontSize: 16, fontWeight: "500", color: "#000" },
  publishButton: {
    backgroundColor: "#6f42c1",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  publishText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
