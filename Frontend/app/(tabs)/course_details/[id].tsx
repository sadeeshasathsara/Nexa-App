import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CourseOverview from "../../../components/tutor.components/CourseOverview";
import CourseLessons from "../../../components/tutor.components/CourseLessons";
import CourseQuizzes from "../../../components/tutor.components/CourseQuizzes";
import CourseChat from "../../../components/tutor.components/CourseChat";
import { Course } from "../../../types/course";
import { API_BASE_URL } from "../../../config/api";

const CourseDetail: React.FC = () => {
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<
    "overview" | "lessons" | "evaluation" | "chat"
  >("overview");
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (data.success) {
          setCourse(data.data);
        } else {
          setError(data.message || 'Failed to fetch course details');
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleLessonPress = (lessonId: string) => {
    const lesson = course.lessons.find((l: any) => l._id === lessonId);
    if (lesson) {
      router.push({
        pathname: '/(tabs)/lesson_details/[id]',
        params: {
          id: lessonId,
          lesson: JSON.stringify(lesson),
          from: from || '',
          courseId: id,
        },
      });
    }
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

  const handleEnroll = async () => {
    if (!course || course.isEnrolled) return;

    try {
      setIsEnrolling(true);
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}/enroll`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        // Reload the page to fetch updated course data
        router.replace(pathname);
      } else {
        console.error('Enrollment failed:', data.message);
        // Show error message to user
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      // Show error message to user
    } finally {
      setIsEnrolling(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CourseOverview course={course} />;

      case "lessons":
        if (from === 'student' && !course.isEnrolled) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Enroll in this course to access lessons.</Text>
            </View>
          );
        }
        if (!course.lessons || course.lessons.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No lessons available for this course.</Text>
            </View>
          );
        }
        return (
          <CourseLessons course={course} onLessonPress={handleLessonPress} />
        );

      case "evaluation":
        if (from === 'student' && !course.isEnrolled) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Enroll in this course to access evaluations.</Text>
            </View>
          );
        }
        const evaluations = [
          ...(course.assignments || []),
          ...(course.quizzes || []).map((quiz: any) => ({
            ...quiz,
            type: 'quiz',
            title: quiz.title,
            questions: quiz.questions?.length || 0,
            difficulty: quiz.difficulty,
            id: quiz._id,
            duration: 'N/A', // or calculate if needed
            createdAt: quiz.createdAt,
          })),
        ];
        if (evaluations.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No evaluations available for this course.</Text>
            </View>
          );
        }
        return (
          <CourseQuizzes
            quizzes={evaluations}
            onQuizPress={handleQuizPress}
            onReviewPress={handleReviewPress}
            onGenerateQuiz={handleGenerateQuiz}
            isStudent={from === 'student'}
          />
        );

      case "chat":
        if (from === 'student' && !course.isEnrolled) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Enroll in this course to access chat.</Text>
            </View>
          );
        }
        return <CourseChat />;

      default:
        return <CourseOverview course={course} />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  const handleBackPress = () => {
    if (from === 'student') {
      router.push('/(tabs)/(student_tabs)/courses');
    } else if (from === 'tutor') {
      router.push('/(tabs)/(tutor_tabs)/courses');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSubtitle}>
          {course.category} • {course.difficulty} • {course.durationWeeks} weeks
        </Text>
        {from === 'student' && !course.isEnrolled && (
          <TouchableOpacity
            style={[styles.enrollButton, isEnrolling && styles.enrollButtonDisabled]}
            onPress={handleEnroll}
            disabled={isEnrolling}
          >
            <Text style={styles.enrollButtonText}>
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        {(["overview", "lessons", "evaluation", "chat"] as const).map((tab) => (
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

      {/* Floating Chatbot Button - Hidden only when on Chat tab */}
      {activeTab !== "chat" && (
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => router.push({
            pathname: "/(tabs)/(chatbot)",
            params: { courseId: id }
          })}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  enrollButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  enrollButtonDisabled: {
    backgroundColor: "#ccc",
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // Floating Chatbot Button
  chatbotButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CourseDetail;
