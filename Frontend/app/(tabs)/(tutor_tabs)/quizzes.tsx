import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../../config/api";

const { width } = Dimensions.get("window");

interface Quiz {
  _id: string;
  name: string;
  numberOfQuestions: number;
  difficulty: string;
  courseName: string;
  isAvailable: boolean | null;
  createdAt: string;
}

const quizIcons = [
  "calculator",
  "flask",
  "time",
  "earth",
  "book",
  "school",
  "bulb",
  "trophy",
  "star",
  "medal",
];

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/`);
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.data);
      } else {
        Alert.alert("Error", "Failed to fetch quizzes");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      Alert.alert("Error", "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const getRandomIcon = (index: number) => {
    return quizIcons[index % quizIcons.length];
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Available Quizzes</Text>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonHeader}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonCategory} />
                </View>
              </View>
              <View style={styles.skeletonDescription} />
              <View style={styles.skeletonFooter}>
                <View style={styles.skeletonStats}>
                  <View style={styles.skeletonStat} />
                  <View style={styles.skeletonStat} />
                </View>
                <View style={styles.skeletonBadge} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Quizzes</Text>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {quizzes.map((quiz, index) => (
          <TouchableOpacity
            key={quiz._id}
            style={styles.card}
            onPress={() => router.push(`(quiz)/take?quizId=${quiz._id}`)}
          >
            <View style={styles.cardHeader}>

              <View style={styles.headerContent}>
                <Text style={styles.title}>{quiz.name}</Text>
                <Text style={styles.category}>{quiz.courseName}</Text>
              </View>
            </View>

            <Text style={styles.description}>Test your knowledge with this quiz</Text>

            <View style={styles.cardFooter}>
              <View style={styles.statsContainer}>
                <View style={styles.firstLine}>
                  <View style={styles.stat}>
                    <Ionicons name="help-circle" size={16} color="#64748b" />
                    <Text style={styles.statText}>{quiz.numberOfQuestions} questions</Text>
                  </View>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.secondLine}>
                  <View style={styles.stat}>
                    <Ionicons name="calendar" size={16} color="#64748b" />
                    <Text style={styles.statText}>{new Date(quiz.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "column",
    width: "100%",
  },
  firstLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  secondLine: {
    flexDirection: "row",
    width: "100%",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  difficultyBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: "#d97706",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  skeletonCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    marginRight: 16,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    height: 18,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonCategory: {
    height: 14,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    width: "60%",
  },
  skeletonDescription: {
    height: 14,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonFooter: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 8,
  },
  skeletonStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  skeletonStat: {
    height: 13,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    width: "40%",
  },
  skeletonBadge: {
    height: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 20,
    width: "30%",
  },
});
