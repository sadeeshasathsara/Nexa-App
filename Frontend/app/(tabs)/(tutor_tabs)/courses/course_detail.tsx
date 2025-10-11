import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  completed: boolean;
}

interface CourseSection {
  title: string;
  data: Lesson[];
}

export default function CourseDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const courseId = params.id as string;

  const [course] = useState({
    id: courseId,
    title: "Mathematics Basics",
    description: "Fundamental concepts of algebra, geometry, and calculus for beginners.",
    students: 23,
    progress: 85,
    rating: 4.9,
    duration: "12 hours",
    level: "Beginner",
  });

  const [sections, setSections] = useState<CourseSection[]>([
    {
      title: "Algebra Fundamentals",
      data: [
        { id: "1", title: "Introduction to Algebra", duration: "45 min", type: "video", completed: true },
        { id: "2", title: "Linear Equations", duration: "60 min", type: "video", completed: true },
        { id: "3", title: "Quadratic Functions", duration: "50 min", type: "video", completed: false },
        { id: "4", title: "Polynomials", duration: "55 min", type: "video", completed: false },
      ],
    },
    {
      title: "Geometry Basics",
      data: [
        { id: "5", title: "Points, Lines, and Angles", duration: "40 min", type: "video", completed: false },
        { id: "6", title: "Triangles and Quadrilaterals", duration: "55 min", type: "video", completed: false },
        { id: "7", title: "Circles and Their Properties", duration: "50 min", type: "video", completed: false },
      ],
    },
    {
      title: "Calculus Introduction",
      data: [
        { id: "8", title: "Limits and Continuity", duration: "65 min", type: "video", completed: false },
        { id: "9", title: "Derivatives", duration: "70 min", type: "video", completed: false },
        { id: "10", title: "Applications of Derivatives", duration: "60 min", type: "video", completed: false },
      ],
    },
  ]);

  const handleGenerateQuiz = () => {
    router.push({
      pathname: "/quiz/generate_quiz",
      params: { courseId: course.id, courseTitle: course.title }
    });
  };

  const handleAddLesson = () => {
    Alert.alert("Add Lesson", "Add new lesson functionality coming soon!");
  };

  const handleEditLesson = (lessonId: string) => {
    Alert.alert("Edit Lesson", `Edit lesson ${lessonId} functionality coming soon!`);
  };

  const toggleLessonCompletion = (sectionIndex: number, lessonIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].data[lessonIndex].completed = 
      !newSections[sectionIndex].data[lessonIndex].completed;
    setSections(newSections);
  };

  const renderLessonItem = ({ item, section, index }: { item: Lesson; section: CourseSection; index: number }) => {
    const sectionIndex = sections.findIndex(s => s.title === section.title);
    const lessonIndex = section.data.findIndex(l => l.id === item.id);

    return (
      <TouchableOpacity 
        style={styles.lessonItem}
        onPress={() => handleEditLesson(item.id)}
      >
        <View style={styles.lessonLeft}>
          <TouchableOpacity 
            style={styles.completionButton}
            onPress={() => toggleLessonCompletion(sectionIndex, lessonIndex)}
          >
            <Ionicons 
              name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={item.completed ? "#10b981" : "#cbd5e1"} 
            />
          </TouchableOpacity>
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>{item.title}</Text>
            <View style={styles.lessonMeta}>
              <Text style={styles.lessonDuration}>{item.duration}</Text>
              <View style={styles.lessonType}>
                <Ionicons 
                  name={item.type === "video" ? "videocam" : "document"} 
                  size={12} 
                  color="#64748b" 
                />
                <Text style={styles.lessonTypeText}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#64748b" />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#1e3a8a", "#3b82f6"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>{course.title}</Text>
        </View>

        {/* Course Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.courseDescription}>{course.description}</Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="#64748b" />
              <Text style={styles.statText}>{course.students} Students</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="#64748b" />
              <Text style={styles.statText}>{course.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#64748b" />
              <Text style={styles.statText}>{course.rating} Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="speedometer" size={16} color="#64748b" />
              <Text style={styles.statText}>{course.level}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Course Progress</Text>
              <Text style={styles.progressPercentage}>{course.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${course.progress}%` }]} 
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGenerateQuiz}
          >
            <Ionicons name="document-text" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Generate Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleAddLesson}
          >
            <Ionicons name="add" size={20} color="#3b82f6" />
            <Text style={styles.secondaryButtonText}>Add Lesson</Text>
          </TouchableOpacity>
        </View>

        {/* Course Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderLessonItem}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <Text style={styles.lessonCount}>
                  {section.data.length} lessons
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  overviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseDescription: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 22,
    marginBottom: 16,
  },
  courseStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#64748b",
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 3,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 2,
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
    flex: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  secondaryButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  contentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  lessonCount: {
    fontSize: 14,
    color: "#64748b",
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lessonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  completionButton: {
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  lessonDuration: {
    fontSize: 14,
    color: "#64748b",
  },
  lessonType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lessonTypeText: {
    fontSize: 12,
    color: "#64748b",
  },
});