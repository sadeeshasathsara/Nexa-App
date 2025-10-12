import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Course } from "../../types/course";

interface CourseLessonsProps {
  course: Course;
  onLessonPress?: (lessonId: string) => void;
}

const CourseLessons: React.FC<CourseLessonsProps> = ({
  course,
  onLessonPress,
}) => {
  const handleLessonPress = (lessonId: string) => {
    if (onLessonPress) {
      onLessonPress(lessonId);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {course.lessons.map((lesson, index) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.lessonItem}
          onPress={() => handleLessonPress(lesson.id)}
        >
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>{index + 1}</Text>
          </View>

          <View style={styles.lessonContent}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
          </View>

          <View style={styles.lessonStatus}>
            {lesson.completed ? (
              <Ionicons name="checkmark-circle" size={24} color="#28a745" />
            ) : (
              <Ionicons name="play-circle" size={24} color="#007AFF" />
            )}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.completionStats}>
        <Text style={styles.completionText}>
          {course.lessons.filter((lesson) => lesson.completed).length} of{" "}
          {course.lessons.length} lessons completed
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lessonNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: "#666",
  },
  lessonStatus: {
    marginLeft: 12,
  },
  completionStats: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    alignItems: "center",
  },
  completionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});

export default CourseLessons;
