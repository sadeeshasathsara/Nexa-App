import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import CourseCard from "../../../components/tutor.components/CourseCard";

const CoursesPage = () => {
  // Mock data - replace with your actual data
  const courses = [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      subtitle: "JS 12 lessons • 8 hours",
      progress: 75,
      lessons: 12,
      hours: "8 hours",
    },
    {
      id: "2",
      title: "React Native Mastery",
      subtitle: "RN 15 lessons • 10 hours",
      progress: 45,
      lessons: 15,
      hours: "10 hours",
    },
    {
      id: "3",
      title: "Node.js Backend",
      subtitle: "Node 10 lessons • 6 hours",
      progress: 20,
      lessons: 10,
      hours: "6 hours",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseCard course={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingVertical: 16,
  },
});

export default CoursesPage;
