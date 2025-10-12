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

export default function CourseList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  const courses = [
    {
      id: 1,
      title: "Mathematics Basics",
      students: 23,
      lessons: 12,
      progress: 85,
      color: "#3b82f6",
    },
    {
      id: 2,
      title: "Physics 101",
      students: 15,
      lessons: 8,
      progress: 60,
      color: "#ef4444",
    },
    {
      id: 3,
      title: "Chemistry Fundamentals",
      students: 18,
      lessons: 10,
      progress: 75,
      color: "#10b981",
    },
  ];

  return (
    <LinearGradient colors={["#3b82f6", "#e6e8ecff", "#3b82f6"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Courses</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Courses Grid */}
        <View style={styles.coursesGrid}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => router.push(`/courses/course_detail?id=${course.id}`)}
            >
              <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                <Ionicons name="book" size={32} color="#ffffff" />
              </View>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.courseStats}>
                <View style={styles.stat}>
                  <Ionicons name="people" size={16} color="#64748b" />
                  <Text style={styles.statText}>{course.students}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="document" size={16} color="#64748b" />
                  <Text style={styles.statText}>{course.lessons}</Text>
                </View>
              </View>
              <TouchableOpacity  key= {course.id} style={styles.quizButton} onPress={() => router.push(`/(tutor_tabs)/courses/course_detail?id=${course.id}`)}>
                <Text style={styles.quizButtonText}>Generate Quiz</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  coursesGrid: {
    gap: 16,
  },
  courseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  courseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#64748b",
  },
  quizButton: {
    backgroundColor: "#80b0fdff",
    borderRadius: 8,
    padding: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  quizButtonText: {
    color: "#051862ff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});