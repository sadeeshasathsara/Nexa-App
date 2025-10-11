import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface QuizSettings {
  questionCount: number;
  duration: number;
  difficulty: string;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
    essay: boolean;
  };
  shuffleQuestions: boolean;
  showResults: boolean;
  allowRetakes: boolean;
}

export default function QuizSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<QuizSettings>({
    questionCount: 10,
    duration: 30,
    difficulty: "medium",
    questionTypes: {
      multipleChoice: true,
      trueFalse: false,
      shortAnswer: false,
      essay: false,
    },
    shuffleQuestions: true,
    showResults: true,
    allowRetakes: false,
  });

  const updateSetting = (key: keyof QuizSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateQuestionType = (type: keyof QuizSettings['questionTypes'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      questionTypes: { ...prev.questionTypes, [type]: value },
    }));
  };

  return (
    <LinearGradient colors={["#1e3a8a", "#3b82f6", "#508ff4c6", "#508ff4c6", "#051644ff",]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Quiz Settings</Text>
          <Text style={styles.subtitle}>Configure your quiz parameters</Text>
        </View>

        {/* Basic Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Number of Questions</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.questionCount.toString()}
              onChangeText={(text) => updateSetting("questionCount", parseInt(text) || 0)}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.duration.toString()}
              onChangeText={(text) => updateSetting("duration", parseInt(text) || 0)}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Difficulty Level</Text>
            <View style={styles.difficultyButtons}>
              {["easy", "medium", "hard"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    settings.difficulty === level && styles.difficultyButtonActive,
                  ]}
                  onPress={() => updateSetting("difficulty", level)}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      settings.difficulty === level && styles.difficultyButtonTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Question Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question Types</Text>
          {Object.entries(settings.questionTypes).map(([type, enabled]) => (
            <View key={type} style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {type.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </Text>
              <Switch
                value={enabled}
                onValueChange={(value) => updateQuestionType(type as keyof QuizSettings['questionTypes'], value)}
                trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
                thumbColor="#ffffff"
              />
            </View>
          ))}
        </View>

        {/* Additional Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Options</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Shuffle Questions</Text>
            <Switch
              value={settings.shuffleQuestions}
              onValueChange={(value) => updateSetting("shuffleQuestions", value)}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Show Results Immediately</Text>
            <Switch
              value={settings.showResults}
              onValueChange={(value) => updateSetting("showResults", value)}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Allow Multiple Attempts</Text>
            <Switch
              value={settings.allowRetakes}
              onValueChange={(value) => updateSetting("allowRetakes", value)}
              trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(tutor_tabs)/quiz/quiz_preview")}
          >
            <Text style={styles.primaryButtonText}>Generate Quiz</Text>
            <Ionicons name="rocket" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
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
    marginTop: 40,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 8,
  },
  numberInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  difficultyButtons: {
    flexDirection: "row",
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  difficultyButtonActive: {
    backgroundColor: "#ffffff",
  },
  difficultyButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  difficultyButtonTextActive: {
    color: "#3b82f6",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  switchLabel: {
    fontSize: 16,
    color: "#ffffff",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
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
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});