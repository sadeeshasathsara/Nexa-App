import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Course } from "../../types/course";

interface CourseOverviewProps {
  course: any;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <Text style={styles.overviewText}>{course.description}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Instructor:</Text>
          <Text style={styles.infoValue}>{course.instructor?.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{course.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Difficulty:</Text>
          <Text style={styles.infoValue}>{course.difficulty}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{course.durationWeeks} weeks</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rating:</Text>
          <Text style={styles.infoValue}>{course.rating}/5 ({course.numReviews} reviews)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Enrollments:</Text>
          <Text style={styles.infoValue}>{course.enrollments}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={styles.infoValue}>{course.isEnrolled ? 'Enrolled' : 'Not Enrolled'}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{course.lessons?.length || 0}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {course.assignments?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Assignments</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {course.sessions?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Live Sessions</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overviewText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default CourseOverview;
