import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { Quiz } from "../../types/course";

interface CourseQuizzesProps {
  quizzes: Quiz[];
  onQuizPress?: (quizId: string) => void;
  onReviewPress?: (quizId: string) => void;
  onGenerateQuiz?: () => void;
  isStudent?: boolean;
}

const CourseQuizzes: React.FC<CourseQuizzesProps> = ({
  quizzes,
  onQuizPress,
  onReviewPress,
  isStudent = false,
}) => {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "#28a745";
      case "Medium":
        return "#ffc107";
      case "Hard":
        return "#dc3545";
      default:
        return "#666";
    }
  };

  const handleQuizPress = (quizId: string) => {
    router.push({
      pathname: `/(tabs)/(quiz)/take?quizId=${quizId}`,
    });
  };

  const handleReviewPress = (quizId: string) => {
    if (onReviewPress) {
      onReviewPress(quizId);
    }
  };

  const handleGenerateQuiz = () => {
    router.push("/(tabs)/(quiz)");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {quizzes.map((quiz, index) => (
        <View key={quiz._id || quiz.id || index} style={[
          styles.quizItem,
          quiz.type === 'quiz' ? styles.quizItemQuiz : styles.quizItemAssignment
        ]}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <View style={styles.quizTypeContainer}>
              <Text style={[
                styles.quizType,
                quiz.type === 'quiz' ? styles.quizTypeQuiz : styles.quizTypeAssignment
              ]}>
                {quiz.type === 'quiz' ? 'Quiz' : 'Assignment'}
              </Text>
              <Text
                style={[
                  styles.quizDifficulty,
                  { color: getDifficultyColor(quiz.difficulty) },
                ]}
              >
                {quiz.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.quizDetails}>
            {quiz.questions} questions • {quiz.duration}
          </Text>

          {quiz.completed ? (
            <View style={styles.quizCompleted}>
              <Text style={styles.quizScore}>
                Completed • Score: {quiz.score}%
              </Text>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => handleReviewPress(quiz.id)}
              >
                <Text style={styles.reviewButtonText}>Review</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => handleQuizPress(quiz.id)}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {!isStudent && (
        <TouchableOpacity
          style={styles.aiQuizButton}
          onPress={handleGenerateQuiz}
        >
          <Text style={styles.aiQuizButtonText}>✨ Generate Quiz with AI</Text>
        </TouchableOpacity>
      )}

      <View style={styles.quizStats}>
        <Text style={styles.quizStatsText}>
          {quizzes.filter((quiz) => quiz.completed).length} of {quizzes.length}{" "}
          quizzes completed
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  quizItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  quizItemQuiz: {
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  quizItemAssignment: {
    backgroundColor: "#f3e5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#9c27b0",
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  quizDifficulty: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  quizTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quizType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quizTypeQuiz: {
    color: "#2196f3",
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  quizTypeAssignment: {
    color: "#9c27b0",
    backgroundColor: "rgba(156, 39, 176, 0.1)",
  },
  quizDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  quizCompleted: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizScore: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "500",
  },
  reviewButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  aiQuizButton: {
    backgroundColor: "#6f42c1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  aiQuizButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  quizStats: {
    padding: 16,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    alignItems: "center",
  },
  quizStatsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});

export default CourseQuizzes;
