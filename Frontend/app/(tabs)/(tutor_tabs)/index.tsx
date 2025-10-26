import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../config/api";

const { width } = Dimensions.get("window");

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

export default function TutorDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Dr. Sarah Johnson");
  const [stats, setStats] = useState({
    totalStudents: 45,
    activeCourses: 3,
    quizzesCreated: 12,
    averageRating: 4.8,
  });
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);

  const recentActivities = [
    { id: 1, type: "quiz", title: "Mathematics Basics", date: "2 hours ago" },
    { id: 2, type: "course", title: "Physics 101", date: "1 day ago" },
    {
      id: 3,
      type: "student",
      title: "New student enrolled",
      date: "2 days ago",
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsProfileLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserName(data.data.fullName);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    const fetchTutorSummary = async () => {
      try {
        setIsStatsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/users/tutor-dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats({
            totalStudents: data.data.totalStudents,
            activeCourses: data.data.totalCourses,
            quizzesCreated: data.data.totalQuizzes,
            averageRating: data.data.averageRating,
          });
        }
      } catch (error) {
        console.error('Error fetching tutor summary:', error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchUserProfile();
    fetchTutorSummary();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            {isProfileLoading ? (
              <SkeletonLoader width={200} height={24} borderRadius={4} />
            ) : (
              <Text style={styles.name}>{userName}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#1e3a8a" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {isStatsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={styles.statCard}>
                <SkeletonLoader width={32} height={32} borderRadius={16} />
                <SkeletonLoader width={40} height={24} />
                <SkeletonLoader width={50} height={14} />
              </View>
            ))
          ) : (
            <>
              <View style={styles.statCard}>
                <Ionicons name="people" size={32} color="#3b82f6" />
                <Text style={styles.statNumber}>{stats.totalStudents}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="book" size={32} color="#3b82f6" />
                <Text style={styles.statNumber}>{stats.activeCourses}</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="document-text" size={32} color="#3b82f6" />
                <Text style={styles.statNumber}>{stats.quizzesCreated}</Text>
                <Text style={styles.statLabel}>Quizzes</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="star" size={32} color="#3b82f6" />
                <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/select_course")}
            >
              <Ionicons name="add-circle" size={32} color="#3b82f6" />
              <Text style={styles.actionText}>Create Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/(tutor_tabs)/courses/create")}
            >
              <Ionicons name="book" size={32} color="#3b82f6" />
              <Text style={styles.actionText}>New Course</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="analytics" size={32} color="#3b82f6" />
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar" size={32} color="#3b82f6" />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name={
                      activity.type === "quiz"
                        ? "document-text"
                        : activity.type === "course"
                          ? "book"
                          : "person"
                    }
                    size={20}
                    color="#3b82f6"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 4,
    marginTop: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginTop: 8,
  },
  activityList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: "#64748b",
  },
});
