import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function StudentEducationInfo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    educationLevel: "",
    grade: "",
    school: "",
    learningGoals: "",
  });

  const educationLevels = [
    "Elementary",
    "Middle School",
    "High School",
    "Undergraduate",
    "Graduate",
  ];

  const handleNext = () => {
    if (!formData.educationLevel) {
      alert("Please select your education level");
      return;
    }
    router.push("/(auth)/register/student/subjects-selection");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Step 4 of 5 - Student</Text>
          <Text style={styles.stepSubtitle}>Education Background</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Education Level *</Text>
            <View style={styles.optionsContainer}>
              {educationLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    formData.educationLevel === level &&
                      styles.optionButtonSelected,
                  ]}
                  onPress={() => updateField("educationLevel", level)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.educationLevel === level &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade/Year</Text>
            <TextInput
              style={styles.input}
              value={formData.grade}
              onChangeText={(text) => updateField("grade", text)}
              placeholder="e.g., 10th Grade, 2nd Year"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>School/Institution</Text>
            <TextInput
              style={styles.input}
              value={formData.school}
              onChangeText={(text) => updateField("school", text)}
              placeholder="Enter your school name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Learning Goals</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.learningGoals}
              onChangeText={(text) => updateField("learningGoals", text)}
              placeholder="What do you hope to achieve through tutoring?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continue to Subjects</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
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
  },
  form: {
    gap: 25,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  optionButtonSelected: {
    backgroundColor: "#fff",
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#4facfe",
  },
  nextButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 18,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
