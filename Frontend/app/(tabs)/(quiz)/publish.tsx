// app/(tabs)/(quiz)/publish.tsx
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_BASE_URL } from "../../../config/api";

export default function PublishQuiz() {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();

  const [quizData, setQuizData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [publishNow, setPublishNow] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [allowRetakes, setAllowRetakes] = useState(false);

  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails();
    }
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
        credentials: 'include', // Include cookies for token
      });
      const data = await response.json();
      if (data.success) {
        setQuizData(data.data);
      } else {
        Alert.alert("Error", "Failed to fetch quiz details");
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      Alert.alert("Error", "Failed to fetch quiz details");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setScheduledDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      setScheduledTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const requestPayload = {
        action: "publish",
        settings: {
          publishNow,
          sendNotifications,
          showResults,
          allowRetakes,
          ...(!publishNow && {
            scheduledTime: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate(), scheduledTime.getHours(), scheduledTime.getMinutes()).toISOString(),
          }),
        },
      };

      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Quiz published successfully!");
        router.push("/(tutor_tabs)/quizzes");
      } else {
        Alert.alert("Error", data.message || "Failed to publish quiz");
      }
    } catch (error) {
      console.error("Error publishing quiz:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to publish quiz");
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      const requestPayload = {
        settings: {
          sendNotifications,
          showResults,
          allowRetakes,
          ...(!publishNow && {
            scheduledPublishTime: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate(), scheduledTime.getHours(), scheduledTime.getMinutes()).toISOString(),
          }),
        },
      };

      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Quiz saved as draft successfully!");
        router.push("/(tutor_tabs)/quizzes");
      } else {
        Alert.alert("Error", data.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      Alert.alert("Error", "Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Card */}
        <View style={styles.quizCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.quizTitle}>{quizData.title || "Quiz"}</Text>
            <View style={styles.draftTag}>
              <Text style={styles.draftText}>Draft</Text>
            </View>
          </View>
          <Text style={styles.quizSubtitle}>
            Test your knowledge of {quizData.title || "Quiz"}
          </Text>
          <View style={styles.quizMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#fff" />
              <Text style={styles.metaText}>30 min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trophy-outline" size={16} color="#fff" />
              <Text style={styles.metaText}>100 pts</Text>
            </View>
          </View>
        </View>

        {/* Publishing Options */}
        <Text style={styles.sectionTitle}>Publishing Options</Text>

        <View style={styles.optionBox}>
          <TouchableOpacity
            style={[styles.optionItem, publishNow && styles.optionItemSelected]}
            onPress={() => setPublishNow(true)}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="flash-outline"
                size={20}
                color={publishNow ? "#5b21b6" : "#333"}
              />
              <Text
                style={[styles.optionTitle, publishNow && { color: "#5b21b6" }]}
              >
                Publish Now
              </Text>
            </View>
            <Text style={styles.optionDesc}>
              Make the quiz available immediately for students to take
            </Text>
            <Text style={styles.optionMeta}>
              • Visible instantly • All students
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              !publishNow && styles.optionItemSelected,
            ]}
            onPress={() => setPublishNow(false)}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={!publishNow ? "#5b21b6" : "#333"}
              />
              <Text
                style={[
                  styles.optionTitle,
                  !publishNow && { color: "#5b21b6" },
                ]}
              >
                Schedule for Later
              </Text>
            </View>
            <Text style={styles.optionDesc}>
              Set a specific date and time when the quiz becomes available
            </Text>
            <Text style={styles.optionMeta}>
              • Custom timing • Auto notifications
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scheduling Options */}
        {!publishNow && (
          <>
            <Text style={styles.sectionTitle}>Scheduling Options</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#5b21b6" />
                <Text style={styles.dateTimeText}>
                  {scheduledDate.toDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#5b21b6" />
                <Text style={styles.dateTimeText}>
                  {scheduledTime.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={scheduledDate}
                mode="date"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                testID="timeTimePicker"
                value={scheduledTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onTimeChange}
              />
            )}
          </>
        )}

        {/* Additional Settings */}
        <Text style={styles.sectionTitle}>Additional Settings</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Send notifications</Text>
          <Switch
            value={sendNotifications}
            onValueChange={setSendNotifications}
            trackColor={{ false: "#ddd", true: "#5b21b6" }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show results immediately</Text>
          <Switch
            value={showResults}
            onValueChange={setShowResults}
            trackColor={{ false: "#ddd", true: "#5b21b6" }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Allow retakes</Text>
          <Switch
            value={allowRetakes}
            onValueChange={setAllowRetakes}
            trackColor={{ false: "#ddd", true: "#5b21b6" }}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveDraft, savingDraft && styles.buttonDisabled]}
            onPress={handleSaveDraft}
            disabled={savingDraft || publishing}
          >
            {savingDraft ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.saveDraftText}>Saving...</Text>
              </View>
            ) : (
              <Text style={styles.saveDraftText}>Save Draft</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.publishNow, publishing && styles.buttonDisabled]}
            onPress={handlePublish}
            disabled={publishing || savingDraft}
          >
            {publishing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.publishNowText}>Publishing...</Text>
              </View>
            ) : (
              <Text style={styles.publishNowText}>Publish Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  quizCard: {
    backgroundColor: "#7e22ce",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  draftTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  draftText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  quizSubtitle: { color: "#e0d7ff", marginTop: 6 },
  quizMeta: { flexDirection: "row", marginTop: 10, gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: "#fff", fontSize: 13 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  optionBox: { marginBottom: 20 },
  optionItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  optionItemSelected: {
    borderColor: "#5b21b6",
    backgroundColor: "#f5f3ff",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  optionTitle: { fontWeight: "600", color: "#111", fontSize: 15 },
  optionDesc: { color: "#666", fontSize: 14, marginBottom: 4 },
  optionMeta: { color: "#999", fontSize: 13 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  toggleLabel: { fontSize: 15, color: "#222" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  saveDraft: {
    backgroundColor: "#f3f4f6",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  saveDraftText: { color: "#000", fontWeight: "600" },
  publishNow: {
    backgroundColor: "#5b21b6",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  publishNowText: { color: "#fff", fontWeight: "600" },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#f9f9f9",
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});
