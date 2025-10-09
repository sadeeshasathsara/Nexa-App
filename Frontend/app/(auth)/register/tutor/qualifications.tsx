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

export default function TutorQualifications() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    yearCompleted: "",
    experience: "",
    certifications: "",
    hourlyRate: "",
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");

  const handleNext = () => {
    if (!formData.degree || !formData.experience || subjects.length === 0) {
      alert("Please fill in required fields and add at least one subject");
      return;
    }
    router.push("/(auth)/register/tutor/availability");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects((prev) => [...prev, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects((prev) => prev.filter((s) => s !== subject));
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
          <Text style={styles.stepTitle}>Step 4 of 5 - Tutor</Text>
          <Text style={styles.stepSubtitle}>Qualifications & Expertise</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Highest Degree *</Text>
            <TextInput
              style={styles.input}
              value={formData.degree}
              onChangeText={(text) => updateField("degree", text)}
              placeholder="e.g., Bachelor of Science in Mathematics"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Institution</Text>
            <TextInput
              style={styles.input}
              value={formData.institution}
              onChangeText={(text) => updateField("institution", text)}
              placeholder="University or College name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year Completed</Text>
            <TextInput
              style={styles.input}
              value={formData.yearCompleted}
              onChangeText={(text) => updateField("yearCompleted", text)}
              placeholder="e.g., 2020"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience *</Text>
            <TextInput
              style={styles.input}
              value={formData.experience}
              onChangeText={(text) => updateField("experience", text)}
              placeholder="e.g., 3 years"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Certifications</Text>
            <TextInput
              style={styles.input}
              value={formData.certifications}
              onChangeText={(text) => updateField("certifications", text)}
              placeholder="Any teaching certifications or awards"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hourly Rate ($)</Text>
            <TextInput
              style={styles.input}
              value={formData.hourlyRate}
              onChangeText={(text) => updateField("hourlyRate", text)}
              placeholder="e.g., 25"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subjects You Teach *</Text>
            <View style={styles.subjectInputContainer}>
              <TextInput
                style={styles.subjectInput}
                value={newSubject}
                onChangeText={setNewSubject}
                placeholder="Add a subject you teach"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.addButton} onPress={addSubject}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.subjectsContainer}>
              {subjects.map((subject, index) => (
                <View key={index} style={styles.subjectChip}>
                  <Text style={styles.subjectText}>{subject}</Text>
                  <TouchableOpacity onPress={() => removeSubject(subject)}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continue to Availability</Text>
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
    gap: 20,
  },
  inputGroup: {
    gap: 8,
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
  subjectInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subjectInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  subjectText: {
    color: "#fff",
    fontSize: 14,
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
