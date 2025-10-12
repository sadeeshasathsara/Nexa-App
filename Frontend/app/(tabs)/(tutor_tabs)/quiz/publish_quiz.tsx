import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PublishQuiz() {
  const router = useRouter();
  const [publishSettings, setPublishSettings] = useState({
    publishImmediately: true,
    scheduleDate: "",
    scheduleTime: "",
    notifyStudents: true,
    makeVisible: true,
  });

  const updatePublishSetting = (key: string, value: any) => {
    setPublishSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePublish = () => {
    Alert.alert(
      "Success!",
      "Your quiz has been published successfully!",
      [
        {
          text: "Back to Dashboard",
          onPress: () => router.replace("/(tutor_tabs)/dashboard"),
        },
      ]
    );
  };

  const handleSchedule = () => {
    Alert.alert(
      "Quiz Scheduled",
      "Your quiz has been scheduled for the selected date and time.",
      [
        {
          text: "Back to Dashboard",
          onPress: () => router.replace("/(tutor_tabs)/dashboard"),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#1e3a8a", "#3b86ffc6", "#051644ff"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Publish Quiz</Text>
          <Text style={styles.subtitle}>Finalize and distribute your quiz</Text>
        </View>

        {/* Quiz Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Mathematics Basics Quiz</Text>
          <View style={styles.summaryDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="document-text" size={16} color="#64748b" />
              <Text style={styles.detailText}>10 Questions</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={16} color="#64748b" />
              <Text style={styles.detailText}>30 Minutes</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="school" size={16} color="#64748b" />
              <Text style={styles.detailText}>23 Students</Text>
            </View>
          </View>
        </View>

        {/* Publish Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publish Options</Text>
          
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Publish Immediately</Text>
              <Text style={styles.optionDescription}>
                Make the quiz available to students right away
              </Text>
            </View>
            <Switch
              value={publishSettings.publishImmediately}
              onValueChange={(value) => updatePublishSetting("publishImmediately", value)}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>

          {!publishSettings.publishImmediately && (
            <View style={styles.scheduleSection}>
              <Text style={styles.scheduleTitle}>Schedule Publication</Text>
              <View style={styles.scheduleInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    value={publishSettings.scheduleDate}
                    onChangeText={(text) => updatePublishSetting("scheduleDate", text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={publishSettings.scheduleTime}
                    onChangeText={(text) => updatePublishSetting("scheduleTime", text)}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Notify Students</Text>
              <Text style={styles.optionDescription}>
                Send notification to enrolled students
              </Text>
            </View>
            <Switch
              value={publishSettings.notifyStudents}
              onValueChange={(value) => updatePublishSetting("notifyStudents", value)}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Make Visible</Text>
              <Text style={styles.optionDescription}>
                Show quiz in course materials
              </Text>
            </View>
            <Switch
              value={publishSettings.makeVisible}
              onValueChange={(value) => updatePublishSetting("makeVisible", value)}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {publishSettings.publishImmediately ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePublish}
            >
              <Text style={styles.primaryButtonText}>Publish Now</Text>
              <Ionicons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSchedule}
            >
              <Text style={styles.primaryButtonText}>Schedule Quiz</Text>
              <Ionicons name="calendar" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Back to Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tertiaryButton}
            onPress={() => router.replace("/(tutor_tabs)/dashboard")}
          >
            <Text style={styles.tertiaryButtonText}>Save as Draft</Text>
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
    marginBottom: 30,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  summaryDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#e2e8f0",
  },
  scheduleSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 12,
    fontWeight: "500",
  },
  scheduleInputs: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  tertiaryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tertiaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});