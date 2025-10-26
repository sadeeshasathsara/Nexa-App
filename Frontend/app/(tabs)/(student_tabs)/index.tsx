import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../../config/api";
import CourseCard from "../../../components/tutor.components/CourseCard";

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

export default function StudentHome() {
  const router = useRouter();
  const [summaryMetrics, setSummaryMetrics] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState<boolean>(true);
  const [isCoursesLoading, setIsCoursesLoading] = useState<boolean>(true);
  const [isSessionsLoading, setIsSessionsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      // Fetch user profile
      setIsProfileLoading(true);
      const profileResponse = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        credentials: 'include',
      });
      const profileData = await profileResponse.json();
      if (profileData.success) {
        setUserName(profileData.data.fullName);
      }
      setIsProfileLoading(false);

      // Fetch summary metrics
      setIsSummaryLoading(true);
      const summaryResponse = await fetch(`${API_BASE_URL}/api/users/summary`, {
        method: 'GET',
        credentials: 'include', // Include cookies for token
      });
      const summaryData = await summaryResponse.json();
      if (summaryData.success) {
        setSummaryMetrics(summaryData.data.summaryMetrics);
      }
      setIsSummaryLoading(false);

      // Fetch featured courses
      setIsCoursesLoading(true);
      const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/featured`, {
        method: 'GET',
      });
      const coursesData = await coursesResponse.json();
      if (coursesData.success) {
        // Map to the required format
        const mappedCourses = coursesData.data.map((course: any, index: number) => ({
          id: course._id || course.id,
          title: course.title,
          instructor: course.instructor.fullName,
          progress: 40, // Hardcoded as per user request
        }));
        setFeaturedCourses(mappedCourses);
      }
      setIsCoursesLoading(false);

      // Fetch recommended courses
      setIsRecommendationsLoading(true);
      const recommendationsResponse = await fetch(`${API_BASE_URL}/api/courses/recommendations`, {
        method: 'GET',
        credentials: 'include',
      });
      const recommendationsData = await recommendationsResponse.json();
      if (recommendationsData.success) {
        setRecommendedCourses(recommendationsData.data);
      }
      setIsRecommendationsLoading(false);

      // Fetch upcoming sessions
      setIsSessionsLoading(true);
      const sessionsResponse = await fetch(`${API_BASE_URL}/api/schedule/upcoming`, {
        method: 'GET',
        credentials: 'include',
      });
      const sessionsData = await sessionsResponse.json();
      if (sessionsData.success) {
        // Map to the required format
        const mappedSessions = sessionsData.data.map((session: any, index: number) => ({
          id: session._id || session.id,
          course: session.course.category,
          time: new Date(session.sessionTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          tutor: session.tutor.fullName,
        }));
        setUpcomingSessions(mappedSessions);
      }
      setIsSessionsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsProfileLoading(false);
      setIsSummaryLoading(false);
      setIsCoursesLoading(false);
      setIsSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{userName}! 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {isSummaryLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.statCard}>
                <SkeletonLoader width={24} height={24} borderRadius={12} />
                <SkeletonLoader width={40} height={20} />
                <SkeletonLoader width={50} height={12} />
              </View>
            ))
          ) : (
            summaryMetrics.map((metric, index) => {
              const iconName = metric.icon === 'book' ? 'book' : metric.icon === 'clock' ? 'time' : 'trophy';
              const color = index === 0 ? '#667eea' : index === 1 ? '#4facfe' : '#42e695';
              return (
                <View key={index} style={styles.statCard}>
                  <Ionicons name={iconName} size={24} color={color} />
                  <Text style={styles.statNumber}>{metric.value}</Text>
                  <Text style={styles.statLabel}>{metric.label}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Recommended Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push({
              pathname: "/recommended",
              params: { courses: JSON.stringify(recommendedCourses) }
            })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {isRecommendationsLoading ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Array.from({ length: 3 })}
              keyExtractor={(_, index) => index.toString()}
              renderItem={() => (
                <View style={styles.recommendedSkeletonCard}>
                  <SkeletonLoader width={88} height={88} borderRadius={12} />
                  <View style={styles.skeletonContent}>
                    <SkeletonLoader width="70%" height={16} />
                  </View>
                </View>
              )}
              contentContainerStyle={styles.recommendedList}
            />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recommendedCourses}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.recommendedCard}>
                  <CourseCard course={item} from="student" />
                </View>
              )}
              contentContainerStyle={styles.recommendedList}
            />
          )}
        </View>

        {/* Featured Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Courses</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {isCoursesLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.courseCard}>
                <SkeletonLoader width={50} height={50} borderRadius={25} />
                <View style={styles.courseInfo}>
                  <SkeletonLoader width="70%" height={16} />
                  <SkeletonLoader width="50%" height={14} />
                  <View style={styles.progressContainer}>
                    <SkeletonLoader width="100%" height={6} borderRadius={3} />
                    <SkeletonLoader width={30} height={12} />
                  </View>
                </View>
              </View>
            ))
          ) : (
            featuredCourses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => router.push(`/course_details/${course.id}`)}>
                <View style={styles.courseIcon}>
                  <Ionicons name="book" size={24} color="#667eea" />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseInstructor}>{course.instructor}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${course.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{course.progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {isSessionsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.sessionCard}>
                <SkeletonLoader width={60} height={30} borderRadius={10} />
                <View style={styles.sessionInfo}>
                  <SkeletonLoader width="60%" height={16} />
                  <SkeletonLoader width="40%" height={14} />
                </View>
                <SkeletonLoader width={20} height={20} borderRadius={10} />
              </View>
            ))
          ) : (
            upcomingSessions.map((session) => (
              <TouchableOpacity key={session.id} style={styles.sessionCard} onPress={() => router.push(`/course_details/${session.id}`)}>
                <View style={styles.sessionTime}>
                  <Text style={styles.sessionTimeText}>{session.time}</Text>
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionCourse}>{session.course}</Text>
                  <Text style={styles.sessionTutor}>with {session.tutor}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="search" size={24} color="#667eea" />
              <Text style={styles.actionText}>Find Tutors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="videocam" size={24} color="#4facfe" />
              <Text style={styles.actionText}>Join Class</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text" size={24} color="#42e695" />
              <Text style={styles.actionText}>Assignments</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra bottom padding to ensure content is visible above tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  // Fixed Header Styles
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // For status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
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
  // Scrollable Content Styles
  scrollView: {
    flex: 1,
    marginTop: 120, // Height of header + padding
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#667eea",
    fontWeight: "500",
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  courseInstructor: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  sessionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sessionTime: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 15,
  },
  sessionTimeText: {
    color: "#667eea",
    fontWeight: "bold",
    fontSize: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionCourse: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sessionTutor: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  bottomPadding: {
    height: 20, // Extra space at bottom
  },
  recommendedSkeletonCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: 280,
    height: 120,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  skeletonContent: {
    flex: 1,
    justifyContent: "center",
  },
  recommendedList: {
    paddingHorizontal: 0,
  },
  recommendedCard: {
    marginRight: 15,
  },
});
