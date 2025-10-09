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

export default function StudentHome() {
  const router = useRouter();

  const featuredCourses = [
    { id: 1, title: "Mathematics 101", instructor: "Dr. Smith", progress: 75 },
    {
      id: 2,
      title: "Physics Basics",
      instructor: "Prof. Johnson",
      progress: 40,
    },
    {
      id: 3,
      title: "English Literature",
      instructor: "Dr. Williams",
      progress: 20,
    },
  ];

  const upcomingSessions = [
    { id: 1, course: "Mathematics", time: "10:00 AM", tutor: "Dr. Smith" },
    { id: 2, course: "Physics", time: "2:00 PM", tutor: "Prof. Johnson" },
  ];

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>John Student! 👋</Text>
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
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color="#667eea" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#4facfe" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#42e695" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Featured Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Courses</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredCourses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
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
          ))}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionTime}>
                <Text style={styles.sessionTimeText}>{session.time}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionCourse}>{session.course}</Text>
                <Text style={styles.sessionTutor}>with {session.tutor}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
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
});
