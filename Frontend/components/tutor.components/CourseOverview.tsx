import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Course } from "../../types/course";

interface CourseOverviewProps {
  course: Course;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.overviewText}>{course.overview}</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Course Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${course.progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{course.progress}% Complete</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{course.lessons.length}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {course.quizzes.filter((q) => q.completed).length}/
            {course.quizzes.length}
          </Text>
          <Text style={styles.statLabel}>Quizzes Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.round((course.progress / 100) * 8)}h
          </Text>
          <Text style={styles.statLabel}>Time Spent</Text>
        </View>
      </View>
    </View>
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
  progressContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
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
