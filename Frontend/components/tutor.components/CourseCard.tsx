import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Course {
  _id: string;
  title: string;
  category: string;
  description: string;
  rating: number;
  enrollments: number;
  durationWeeks: number;
  difficulty: string;
  imageUrl: string;
  instructor: {
    _id: string;
    fullName: string;
  };
}

interface CourseCardProps {
  course: Course;
  from?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, from }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: `(tabs)/course_details/${course._id}`,
      params: { from: from || 'tutor' },
    });
  };

  const truncateDescription = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: course.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
    lineHeight: 22,
  },
  category: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  instructor: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  difficultyBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
});

export default CourseCard;
