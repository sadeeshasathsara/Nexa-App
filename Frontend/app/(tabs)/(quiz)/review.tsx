import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../../config/api";

interface Question {
  id: string;
  question: string;
  questionType: "multipleChoice" | "trueFalse" | "shortAnswer";
  options?: string[];
  answer: string;
}

export default function ReviewQuiz() {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courseTitle, setCourseTitle] = useState("Mathematics Quiz");
  const [quizSettings, setQuizSettings] = useState<any>({});

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails();
    }
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
        credentials: 'include', // Include cookies for token
      });
      const data = await response.json();
      if (data.success) {
        // Transform questions to match the interface
        const transformedQuestions = (data.data.questions || []).map((q: any) => ({
          id: q._id,
          question: q.questionText,
          questionType: q.questionType,
          options: q.options,
          answer: q.answer,
        }));
        setQuizData(transformedQuestions);
        setCourseTitle(data.data.title || "Quiz");
        setQuizSettings({
          difficulty: data.data.difficulty,
          numberOfQuestions: transformedQuestions.length,
        });
      } else {
        Alert.alert("Error", "Failed to fetch quiz details");
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      Alert.alert("Error", "Failed to fetch quiz details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuizDetails();
  };

  const handlePublish = () => {
    router.push({
      pathname: "/(quiz)/publish",
      params: { quizId },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Info */}
        <View style={styles.header}>
          <Text style={styles.title}>{courseTitle}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Draft</Text>
          </View>
          <Text style={styles.subtitle}>
            Generated quiz with {quizData.length} questions
          </Text>
          <Text style={styles.meta}>
            ⏱ {quizSettings.numberOfQuestions || quizData.length} questions • 📘 {quizSettings.difficulty || 'Medium'} difficulty
          </Text>
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

            {q.questionType === 'shortAnswer' ? (
              <View style={[styles.option, styles.optionSelected]}>
                <Text style={[styles.optionText, styles.optionTextSelected]}>
                  Answer: {q.answer}
                </Text>
              </View>
            ) : (
              q.options?.map((option, index) => {
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
              })
            )}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
