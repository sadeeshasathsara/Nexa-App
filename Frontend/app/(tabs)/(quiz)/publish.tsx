// app/(tabs)/(quiz)/publish.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublishQuiz() {
  const router = useRouter();

  const [publishNow, setPublishNow] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [allowRetakes, setAllowRetakes] = useState(false);

  const handlePublish = () => {
    // handle your publishing logic here (API call, etc.)
    router.push("/(tutor_tabs)/quizzes"); // navigate to course details
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Card */}
        <View style={styles.quizCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.quizTitle}>JavaScript Fundamentals</Text>
            <View style={styles.draftTag}>
              <Text style={styles.draftText}>Draft</Text>
            </View>
          </View>
          <Text style={styles.quizSubtitle}>
            Test your knowledge of JS basics
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
          <TouchableOpacity style={styles.saveDraft}>
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishNow} onPress={handlePublish}>
            <Text style={styles.publishNowText}>Publish Now</Text>
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
});
