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

export default function TutorAvailability() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeOptions = [
    "Morning (8AM - 12PM)",
    "Afternoon (12PM - 5PM)",
    "Evening (5PM - 9PM)",
    "Weekends",
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimeSlot = (time: string) => {
    setTimeSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleComplete = () => {
    if (selectedDays.length === 0 || timeSlots.length === 0) {
      alert("Please select your availability");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Tutor registration completed:", { selectedDays, timeSlots });

    Alert.alert(
      "Registration Complete!",
      "Welcome to LearnHub! Your tutor profile has been created and is pending approval.",
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
          <Text style={styles.stepTitle}>Step 5 of 5 - Tutor</Text>
          <Text style={styles.stepSubtitle}>Set Your Availability</Text>
          <Text style={styles.stepDescription}>
            Let students know when you're available for sessions. You can update
            this anytime.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Days</Text>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day) && styles.dayTextSelected,
                  ]}
                >
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Time Slots</Text>
          <View style={styles.timeSlotsContainer}>
            {timeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlotButton,
                  timeSlots.includes(time) && styles.timeSlotButtonSelected,
                ]}
                onPress={() => toggleTimeSlot(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    timeSlots.includes(time) && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
                {timeSlots.includes(time) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your Availability Summary:</Text>
          {selectedDays.length > 0 && timeSlots.length > 0 ? (
            <>
              <Text style={styles.summaryText}>
                Days: {selectedDays.join(", ")}
              </Text>
              <Text style={styles.summaryText}>
                Times: {timeSlots.join(", ")}
              </Text>
            </>
          ) : (
            <Text style={styles.summaryText}>
              Please select your availability above
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>Complete Registration</Text>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
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
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  dayButtonSelected: {
    backgroundColor: "#fff",
  },
  dayText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  dayTextSelected: {
    color: "#42e695",
  },
  timeSlotsContainer: {
    gap: 12,
  },
  timeSlotButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  timeSlotButtonSelected: {
    backgroundColor: "#fff",
  },
  timeSlotText: {
    color: "#fff",
    fontSize: 16,
  },
  timeSlotTextSelected: {
    color: "#42e695",
    fontWeight: "500",
  },
  summary: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 5,
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
