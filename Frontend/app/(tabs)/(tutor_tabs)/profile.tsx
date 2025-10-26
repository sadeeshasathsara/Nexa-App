import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../config/api";

export default function TutorProfile() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    studentMessages: true,
    quizResults: false,
  });
  const [profileData, setProfileData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileResponse, summaryResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users/profile`),
        fetch(`${API_BASE_URL}/api/users/tutor-dashboard`)
      ]);

      const profileResult = await profileResponse.json();
      const summaryResult = await summaryResponse.json();

      if (profileResult.success) {
        setProfileData(profileResult.data);
      }
      if (summaryResult.success) {
        setSummaryData(summaryResult.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/(auth)/login"),
      },
    ]);
  };

  const menuItems = [
    {
      icon: "person",
      title: "Edit Profile",
      onPress: () => Alert.alert("Edit Profile", "Coming soon!"),
    },
    {
      icon: "language-outline",
      title: "Preferred Language",
      onPress: () => router.push("/preferred_language"),
    },
    {
      icon: "document-text",
      title: "Quiz History",
      onPress: () => Alert.alert("Quiz History", "Coming soon!"),
    },
    {
      icon: "analytics",
      title: "Performance Analytics",
      onPress: () => Alert.alert("Analytics", "Coming soon!"),
    },
    {
      icon: "settings",
      title: "Settings",
      onPress: () => Alert.alert("Settings", "Coming soon!"),
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      onPress: () => Alert.alert("Help", "Coming soon!"),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://via.placeholder.com/80x80/3b82f6/ffffff?text=Tutor" }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.profileName}>{profileData?.fullName || "Loading..."}</Text>
          <Text style={styles.profileTitle}>{profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : "Tutor"}</Text>
          <Text style={styles.profileBio}>
            {profileData?.email || "Loading..."}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{summaryData?.averageRating || "0"}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{summaryData?.totalStudents || "0"}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{summaryData?.totalCourses || "0"}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsList}>
            {Object.entries(notifications).map(([key, value]) => (
              <View key={key} style={styles.settingRow}>
                <Text style={styles.settingLabel}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Switch
                  value={value}
                  onValueChange={(newValue) =>
                    updateNotification(key, newValue)
                  }
                  trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
                  thumbColor="#ffffff"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon as any} size={20} color="#3b82f6" />
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    marginBottom: 30,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10b981",
    borderRadius: 10,
    padding: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "center",
  },
  profileTitle: {
    fontSize: 16,
    color: "#3b82f6",
    marginBottom: 12,
    fontWeight: "500",
  },
  profileBio: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingLabel: {
    fontSize: 16,
    color: "#1e293b",
  },
  menuList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#1e293b",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 30,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "500",
  },
});
