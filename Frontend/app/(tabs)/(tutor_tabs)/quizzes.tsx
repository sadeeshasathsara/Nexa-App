import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const quizzes = [
  { id: 1, title: "Math Quiz", description: "Test your math skills" },
  { id: 2, title: "Science Quiz", description: "Learn about science" },
  { id: 3, title: "History Quiz", description: "Explore historical events" },
  { id: 4, title: "Geography Quiz", description: "Know your world" },
  { id: 5, title: "English Quiz", description: "Improve your grammar" },
];

export default function QuizzesPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Available Quizzes</Text>
      {quizzes.map((quiz) => (
        <TouchableOpacity key={quiz.id} style={styles.card}>
          <Text style={styles.title}>{quiz.title}</Text>
          <Text style={styles.description}>{quiz.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});
