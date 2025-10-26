import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../../config/api";

const SkeletonLoader = ({ width, height, borderRadius }: { width: number | string; height: number; borderRadius?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        backgroundColor: '#e0e0e0',
        borderRadius: borderRadius || 8,
        opacity: fadeAnim,
      }}
    />
  );
};

export default function CoursesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        let url = `${API_BASE_URL}/api/courses/my-courses`;
        let params = new URLSearchParams();

        if (searchQuery.trim()) {
          url = `${API_BASE_URL}/api/courses`;
          params.append('keyword', searchQuery.trim());
        }

        if (selectedCategory !== "All") {
          params.append('category', selectedCategory);
        }

        const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

        const response = await fetch(fullUrl, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          let courseData = searchQuery.trim() ? data.data.courses : data.data;
          if (!searchQuery.trim()) {
            // My courses are always enrolled
            courseData = courseData.map((course: any) => ({ ...course, isEnrolled: true }));
          } else {
            // For search results, check if each course has isEnrolled property, default to false
            courseData = courseData.map((course: any) => ({
              ...course,
              isEnrolled: course.isEnrolled === true
            }));
          }
          setCourses(courseData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery, selectedCategory]);

  const categories = [
    "All",
    "Mathematics",
    "Science",
    "Languages",
    "Arts",
    "Technology",
  ];

  const filteredCourses = courses; // Already filtered in API call

  return (
    <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Courses</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowSearchInput(!showSearchInput)}
          >
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        {showSearchInput && (
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("");
                setShowSearchInput(false);
              }}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

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
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={styles.courseCard}>
                <SkeletonLoader width="100%" height={100} borderRadius={15} />
                <View style={styles.courseContent}>
                  <SkeletonLoader width="40%" height={10} />
                  <SkeletonLoader width="80%" height={14} />
                  <SkeletonLoader width="60%" height={12} />
                  <View style={styles.courseMeta}>
                    <SkeletonLoader width={30} height={10} />
                    <SkeletonLoader width={30} height={10} />
                    <SkeletonLoader width={30} height={10} />
                  </View>
                  <SkeletonLoader width={40} height={10} borderRadius={5} />
                </View>
              </View>
            ))
          ) : (
            filteredCourses.map((course) => (
              <TouchableOpacity
                key={course._id}
                style={styles.courseCard}
                onPress={() => {
                  router.push({
                    pathname: `/course_details/${course._id}`,
                    params: {
                      from: 'student',
                      isEnrolled: course.isEnrolled ? 'true' : 'false'
                    },
                  });
                }}
              >
                {!course.imageUrl || imageErrors[course._id] ? (
                  <View style={styles.courseImagePlaceholder}>
                    <Ionicons name="book" size={40} color="#667eea" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: course.imageUrl }}
                    style={styles.courseImage}
                    resizeMode="cover"
                    onError={() => setImageErrors(prev => ({ ...prev, [course._id]: true }))}
                  />
                )}
                <View style={styles.courseContent}>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                  <Text style={styles.courseTitle}>
                    {course.title.length > 35 ? course.title.substring(0, 35) + '...' : course.title}
                  </Text>
                  <Text style={styles.courseInstructor}>
                    by {course.instructor.fullName.length > 14 ? course.instructor.fullName.substring(0, 14) + '...' : course.instructor.fullName}
                  </Text>

                  <View style={styles.courseMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.metaText}>{course.rating.toFixed(1)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="people" size={14} color="#667eea" />
                      <Text style={styles.metaText}>{course.enrollments}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color="#42e695" />
                      <Text style={styles.metaText}>{course.durationWeeks} weeks</Text>
                    </View>
                  </View>

                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{course.difficulty}</Text>
                  </View>

                  {/* Enroll Button */}
                  {!course.isEnrolled ? (
                    <TouchableOpacity style={styles.enrollButton}>
                      <Text style={styles.enrollButtonText}>Enroll Now</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.enrolledIndicator}>
                      <Ionicons name="checkmark-circle" size={16} color="#42e695" />
                      <Text style={styles.enrolledText}>Enrolled</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 60, position: "relative" },
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
    marginBottom: 20,
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
    width: "100%",
    height: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  courseImagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
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

  // Search Input Styles
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },

  // Enroll Button Styles
  enrollButton: {
    backgroundColor: "#667eea",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  enrolledIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  enrolledText: {
    color: "#42e695",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});
