import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
}

export default function QuizPreview() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "multipleChoice",
      question: "What is the derivative of x²?",
      options: ["2x", "x", "2", "x²"],
      correctAnswer: "2x",
    },
    {
      id: "2",
      type: "trueFalse",
      question: "The square root of 16 is 4.",
      correctAnswer: "true",
    },
    {
      id: "3",
      type: "shortAnswer",
      question: "Solve for x: 2x + 5 = 15",
      correctAnswer: "5",
    },
  ]);

  const handleEditQuestion = (questionId: string) => {
    Alert.alert("Edit Question", "Edit functionality coming soon!");
  };

  const handleRegenerateQuestion = (questionId: string) => {
    Alert.alert("Regenerate Question", "This question will be regenerated.");
  };

  const handleFinalize = () => {
    router.push("/(tutor_tabs)/quiz/publish_quiz");
  };

  return (
    <LinearGradient colors={["#1e3a8a", "#3b82f6", "#051644ff"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Quiz Preview</Text>
          <Text style={styles.subtitle}>Review and edit generated questions</Text>
        </View>

        {/* Quiz Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Questions</Text>
              <Text style={styles.summaryValue}>{questions.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Estimated Time</Text>
              <Text style={styles.summaryValue}>30 min</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Difficulty</Text>
              <Text style={styles.summaryValue}>Medium</Text>
            </View>
          </View>
        </View>

        {/* Questions List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions ({questions.length})</Text>
          <View style={styles.questionsList}>
            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>Q{index + 1}</Text>
                  <View style={styles.questionActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditQuestion(question.id)}
                    >
                      <Ionicons name="create" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleRegenerateQuestion(question.id)}
                    >
                      <Ionicons name="refresh" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.questionText}>{question.question}</Text>
                
                {question.type === "multipleChoice" && question.options && (
                  <View style={styles.optionsList}>
                    {question.options.map((option, optIndex) => (
                      <View key={optIndex} style={styles.optionItem}>
                        <Text style={styles.optionText}>{option}</Text>
                        {option === question.correctAnswer && (
                          <Ionicons name="checkmark" size={16} color="#10b981" />
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {question.type === "trueFalse" && (
                  <View style={styles.optionsList}>
                    <View style={styles.optionItem}>
                      <Text style={styles.optionText}>True</Text>
                      {question.correctAnswer === "true" && (
                        <Ionicons name="checkmark" size={16} color="#10b981" />
                      )}
                    </View>
                    <View style={styles.optionItem}>
                      <Text style={styles.optionText}>False</Text>
                      {question.correctAnswer === "false" && (
                        <Ionicons name="checkmark" size={16} color="#10b981" />
                      )}
                    </View>
                  </View>
                )}

                {question.type === "shortAnswer" && (
                  <View style={styles.answerSection}>
                    <Text style={styles.answerLabel}>Correct Answer:</Text>
                    <Text style={styles.correctAnswer}>{question.correctAnswer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleFinalize}
          >
            <Text style={styles.primaryButtonText}>Finalize Quiz</Text>
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Back to Settings</Text>
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
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
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
  questionsList: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  questionActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  questionText: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  optionText: {
    fontSize: 14,
    color: "#1e293b",
  },
  answerSection: {
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  answerLabel: {
    fontSize: 14,
    color: "#166534",
    fontWeight: "500",
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 14,
    color: "#166534",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});