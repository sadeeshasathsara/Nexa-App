import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function CoursesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Mathematics",
    "Science",
    "Languages",
    "Arts",
    "Technology",
  ];

  const courses = [
    {
      id: 1,
      title: "Advanced Calculus",
      category: "Mathematics",
      instructor: "Dr. Sarah Wilson",
      rating: 4.8,
      students: 1200,
      duration: "12 weeks",
      level: "Advanced",
      image: "📊",
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      category: "Science",
      instructor: "Prof. Michael Brown",
      rating: 4.6,
      students: 850,
      duration: "10 weeks",
      level: "Intermediate",
      image: "🔬",
    },
    {
      id: 3,
      title: "Spanish for Beginners",
      category: "Languages",
      instructor: "Maria Garcia",
      rating: 4.9,
      students: 2000,
      duration: "8 weeks",
      level: "Beginner",
      image: "🇪🇸",
    },
    {
      id: 4,
      title: "Web Development",
      category: "Technology",
      instructor: "Alex Chen",
      rating: 4.7,
      students: 1500,
      duration: "14 weeks",
      level: "Intermediate",
      image: "💻",
    },
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  return (
    <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Courses</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Course Grid */}
        <View style={styles.coursesGrid}>
          {filteredCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() =>
                router.push("/student_tabs/(student)/course-details")
              }
            >
              <View style={styles.courseImage}>
                <Text style={styles.courseEmoji}>{course.image}</Text>
              </View>
              <View style={styles.courseContent}>
                <Text style={styles.courseCategory}>{course.category}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseInstructor}>
                  by {course.instructor}
                </Text>

                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.metaText}>{course.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people" size={14} color="#667eea" />
                    <Text style={styles.metaText}>{course.students}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={14} color="#42e695" />
                    <Text style={styles.metaText}>{course.duration}</Text>
                  </View>
                </View>

                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{course.level}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Visible Chatbot Button */}
        <TouchableOpacity
          style={styles.chatbotVisibleButton}
          onPress={() => router.push("/(chatbot)")}
        >
          <Ionicons name="chatbubbles-outline" size={22} color="#fff" />
          <Text style={styles.chatbotVisibleText}>Chat with AI Tutor</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 50,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoriesContainer: { marginBottom: 25 },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryButtonActive: { backgroundColor: "#667eea" },
  categoryText: { color: "#666", fontWeight: "500" },
  categoryTextActive: { color: "#fff" },
  coursesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  courseCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseImage: {
    height: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  courseEmoji: { fontSize: 40 },
  courseContent: { padding: 12 },
  courseCategory: {
    fontSize: 10,
    color: "#667eea",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  courseInstructor: { fontSize: 12, color: "#666", marginBottom: 8 },
  courseMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 10, color: "#666", marginLeft: 2 },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: { fontSize: 10, color: "#667eea", fontWeight: "600" },

  // ✅ Visible Chatbot Button
  chatbotVisibleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#667eea",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 150,
  },
  chatbotVisibleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },

  // Floating Chatbot Button (optional)
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
