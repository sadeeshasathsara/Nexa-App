import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import CourseOverview from "../../../components/tutor.components/CourseOverview";
import CourseLessons from "../../../components/tutor.components/CourseLessons";
import CourseQuizzes from "../../../components/tutor.components/CourseQuizzes";
import CourseChat from "../../../components/tutor.components/CourseChat";
import { Course } from "../../../types/course";

const CourseDetail: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<
    "overview" | "lessons" | "quizzes" | "chat"
  >("overview");

  // Mock course data - replace with actual data fetching
  const course: Course = {
    id: id || "1",
    title: "JavaScript Fundamentals",
    subtitle: "JS 12 lessons • 8 hours",
    progress: 75,
    overview:
      "Learn the fundamentals of JavaScript programming including variables, data types, functions, scope, arrays, objects, and more. This course will take you from beginner to proficient in JavaScript.",
    lessons: [
      {
        id: "1",
        title: "Variables and Data Types",
        duration: "30 min",
        completed: true,
      },
      {
        id: "2",
        title: "Functions and Scope",
        duration: "45 min",
        completed: true,
      },
      {
        id: "3",
        title: "Arrays and Objects",
        duration: "60 min",
        completed: false,
      },
      {
        id: "4",
        title: "DOM Manipulation",
        duration: "50 min",
        completed: false,
      },
      {
        id: "5",
        title: "Event Handling",
        duration: "40 min",
        completed: false,
      },
    ],
    quizzes: [
      {
        id: "1",
        title: "Variables and Data Types",
        questions: 10,
        duration: "5 min",
        difficulty: "Easy",
        completed: true,
        score: 85,
      },
      {
        id: "2",
        title: "Functions and Scope",
        questions: 12,
        duration: "8 min",
        difficulty: "Medium",
        completed: true,
        score: 92,
      },
      {
        id: "3",
        title: "Arrays and Objects",
        questions: 15,
        duration: "10 min",
        difficulty: "Medium",
        completed: false,
      },
    ],
  };

  const handleLessonPress = (lessonId: string) => {
    console.log("Lesson pressed:", lessonId);
    // Navigate to lesson detail or start lesson
  };

  const handleQuizPress = (quizId: string) => {
    console.log("Quiz pressed:", quizId);
    // Start or continue quiz
  };

  const handleReviewPress = (quizId: string) => {
    console.log("Review quiz:", quizId);
    // Navigate to quiz review
  };

  const handleGenerateQuiz = () => {
    console.log("Generate AI quiz");
    // Generate AI quiz logic
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CourseOverview course={course} />;

      case "lessons":
        return (
          <CourseLessons course={course} onLessonPress={handleLessonPress} />
        );

      case "quizzes":
        return (
          <CourseQuizzes
            quizzes={course.quizzes}
            onQuizPress={handleQuizPress}
            onReviewPress={handleReviewPress}
            onGenerateQuiz={handleGenerateQuiz}
          />
        );

      case "chat":
        return <CourseChat />;

      default:
        return <CourseOverview course={course} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
      </View>

      <View style={styles.tabContainer}>
        {(["overview", "lessons", "quizzes", "chat"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
  },
  content: {
    flex: 1,
  },
});

export default CourseDetail;
