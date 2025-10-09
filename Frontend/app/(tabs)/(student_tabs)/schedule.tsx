import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const scheduleData = {
    Mon: [
      {
        time: "09:00 AM",
        subject: "Mathematics",
        tutor: "Dr. Smith",
        type: "lecture",
      },
      {
        time: "02:00 PM",
        subject: "Physics",
        tutor: "Prof. Johnson",
        type: "lab",
      },
    ],
    Tue: [
      {
        time: "10:00 AM",
        subject: "English",
        tutor: "Ms. Davis",
        type: "discussion",
      },
      {
        time: "04:00 PM",
        subject: "Chemistry",
        tutor: "Dr. Wilson",
        type: "lecture",
      },
    ],
    Wed: [
      { time: "11:00 AM", subject: "Biology", tutor: "Dr. Brown", type: "lab" },
    ],
    Today: [
      {
        time: "10:00 AM",
        subject: "Mathematics",
        tutor: "Dr. Smith",
        type: "lecture",
      },
      {
        time: "02:00 PM",
        subject: "Physics",
        tutor: "Prof. Johnson",
        type: "lab",
      },
    ],
  };

  const getDaySchedule = (day: string) => {
    return scheduleData[day as keyof typeof scheduleData] || [];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      lecture: "#667eea",
      lab: "#4facfe",
      discussion: "#42e695",
    };
    return colors[type as keyof typeof colors] || "#667eea";
  };

  return (
    <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Schedule</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="calendar" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.datesContainer}
        >
          {dates.map((date, index) => {
            const dayName = days[date.getDay()];
            const dayNumber = date.getDate();
            const isToday = index === 0;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateButton, isToday && styles.dateButtonActive]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayName, isToday && styles.dayNameActive]}>
                  {isToday ? "Today" : dayName}
                </Text>
                <Text
                  style={[styles.dayNumber, isToday && styles.dayNumberActive]}
                >
                  {dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Schedule List */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>
            {selectedDate.toDateString() === new Date().toDateString()
              ? "Today's Classes"
              : selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
          </Text>

          {getDaySchedule(
            selectedDate.toDateString() === new Date().toDateString()
              ? "Today"
              : days[selectedDate.getDay()]
          ).length > 0 ? (
            getDaySchedule(
              selectedDate.toDateString() === new Date().toDateString()
                ? "Today"
                : days[selectedDate.getDay()]
            ).map((session, index) => (
              <TouchableOpacity key={index} style={styles.sessionCard}>
                <View style={styles.sessionTime}>
                  <Text style={styles.sessionTimeText}>{session.time}</Text>
                </View>
                <View style={styles.sessionContent}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionSubject}>{session.subject}</Text>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: getTypeColor(session.type) },
                      ]}
                    >
                      <Text style={styles.typeText}>{session.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionTutor}>with {session.tutor}</Text>
                  <View style={styles.sessionActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="videocam" size={16} color="#667eea" />
                      <Text style={styles.actionText}>Join</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons
                        name="document-text"
                        size={16}
                        color="#4facfe"
                      />
                      <Text style={styles.actionText}>Materials</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No classes scheduled</Text>
              <Text style={styles.emptyStateSubtext}>
                Enjoy your free time!
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.assignmentsSection}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          <View style={styles.assignmentCard}>
            <View style={styles.assignmentIcon}>
              <Ionicons name="document-text" size={24} color="#667eea" />
            </View>
            <View style={styles.assignmentInfo}>
              <Text style={styles.assignmentTitle}>Calculus Problem Set</Text>
              <Text style={styles.assignmentCourse}>
                Mathematics - Due Tomorrow
              </Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  datesContainer: {
    marginBottom: 25,
  },
  dateButton: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateButtonActive: {
    backgroundColor: "#667eea",
  },
  dayName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  dayNameActive: {
    color: "#fff",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
  dayNumberActive: {
    color: "#fff",
  },
  scheduleSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  sessionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sessionTime: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 15,
    alignSelf: "flex-start",
  },
  sessionTimeText: {
    color: "#667eea",
    fontWeight: "bold",
    fontSize: 12,
  },
  sessionContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sessionTutor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  sessionActions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#667eea",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  assignmentsSection: {
    marginBottom: 25,
  },
  assignmentCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  assignmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  assignmentCourse: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#667eea",
    fontSize: 12,
    fontWeight: "500",
  },
});
