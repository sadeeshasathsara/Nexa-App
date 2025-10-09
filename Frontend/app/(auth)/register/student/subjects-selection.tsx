import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function StudentSubjectsSelection() {
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Business Studies",
    "Art",
    "Music",
    "Foreign Languages",
    "Social Studies",
    "Psychology",
  ];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleComplete = () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    // Here you would typically send the data to your backend
    console.log(
      "Student registration completed with subjects:",
      selectedSubjects
    );

    Alert.alert(
      "Registration Complete!",
      "Welcome to LearnHub! Your student account has been created successfully.",
      [
        {
          text: "Get Started",
          onPress: () => router.replace("/(tabs)"),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#42e695", "#3bb2b8"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Step 5 of 5 - Student</Text>
          <Text style={styles.stepSubtitle}>Select Subjects</Text>
          <Text style={styles.stepDescription}>
            Choose the subjects you need help with. You can always update this
            later.
          </Text>
        </View>

        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.subjectChip,
                selectedSubjects.includes(subject) &&
                  styles.subjectChipSelected,
              ]}
              onPress={() => toggleSubject(subject)}
            >
              <Text
                style={[
                  styles.subjectText,
                  selectedSubjects.includes(subject) &&
                    styles.subjectTextSelected,
                ]}
              >
                {subject}
              </Text>
              {selectedSubjects.includes(subject) && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            {selectedSubjects.length} subject(s) selected
          </Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>Complete Registration</Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
    marginTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 5,
  },
  stepSubtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 40,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    gap: 8,
  },
  subjectChipSelected: {
    backgroundColor: "#fff",
  },
  subjectText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  subjectTextSelected: {
    color: "#42e695",
  },
  footer: {
    gap: 20,
  },
  selectedCount: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completeButtonText: {
    color: "#42e695",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
