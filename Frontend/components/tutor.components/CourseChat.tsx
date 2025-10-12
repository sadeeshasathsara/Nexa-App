import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CourseChat = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello, I have a question about the variables lesson.",
      sender: "student",
      studentName: "Alice Johnson",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "2",
      text: "Sure Alice! What specific concept are you struggling with?",
      sender: "tutor",
      timestamp: new Date(Date.now() - 3500000),
      read: true,
    },
    {
      id: "3",
      text: "I'm confused about the difference between let and const.",
      sender: "student",
      studentName: "Alice Johnson",
      timestamp: new Date(Date.now() - 3400000),
      read: true,
    },
    {
      id: "4",
      text: "Great question! let allows reassignment while const does not. Let me share an example...",
      sender: "tutor",
      timestamp: new Date(Date.now() - 3300000),
      read: true,
    },
    {
      id: "5",
      text: "Hi, when is the next quiz scheduled?",
      sender: "student",
      studentName: "Bob Smith",
      timestamp: new Date(Date.now() - 1800000),
      read: true,
    },
    {
      id: "6",
      text: "Hello Bob! The next quiz is on Friday. Have you completed the arrays lesson?",
      sender: "tutor",
      timestamp: new Date(Date.now() - 1700000),
      read: true,
    },
    {
      id: "7",
      text: "Not yet, I'm working on it now. The objects part is a bit challenging.",
      sender: "student",
      studentName: "Bob Smith",
      timestamp: new Date(Date.now() - 1600000),
      read: false,
    },
    {
      id: "8",
      text: "I need help with function scope. Can you explain it again?",
      sender: "student",
      studentName: "Carol Davis",
      timestamp: new Date(Date.now() - 900000),
      read: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<any>>(null);

  // Extract unique students from messages
  const students = [
    ...new Set(
      messages
        .filter(
          (msg) => msg.sender === "student" && msg.studentName !== undefined
        )
        .map((msg) => msg.studentName as string)
    ),
  ];

  // Filter messages based on selected student
  const filteredMessages = selectedStudent
    ? messages.filter(
        (msg) => msg.sender === "tutor" || msg.studentName === selectedStudent
      )
    : messages;

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: "tutor",
      timestamp: new Date(),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (
      messageDate.getDate() === today.getDate() - 1 &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: (typeof messages)[0];
    index: number;
  }) => {
    const showDate =
      index === 0 ||
      formatDate(item.timestamp) !== formatDate(messages[index - 1]?.timestamp);

    const isTutor = item.sender === "tutor";
    const messageStyles = isTutor ? tutorMessageStyles : studentMessageStyles;

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.messageContainer,
            isTutor ? styles.tutorMessage : styles.studentMessage,
          ]}
          onPress={() => !item.read && markAsRead(item.id)}
        >
          <View style={styles.messageHeader}>
            <Text
              style={[styles.senderName, isTutor && styles.tutorSenderName]}
            >
              {isTutor ? "You" : item.studentName}
            </Text>
            <Text style={[styles.timestamp, isTutor && styles.tutorTimestamp]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>

          <Text
            style={[styles.messageText, isTutor && styles.tutorMessageText]}
          >
            {item.text}
          </Text>

          {!isTutor && !item.read && (
            <View style={styles.unreadIndicator}>
              <Text style={styles.unreadText}>New</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Student Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedStudent && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedStudent(null)}
        >
          <Text
            style={[
              styles.filterButtonText,
              !selectedStudent && styles.filterButtonTextActive,
            ]}
          >
            All Students
          </Text>
        </TouchableOpacity>

        {students.map((student) => (
          <TouchableOpacity
            key={student}
            style={[
              styles.filterButton,
              selectedStudent === student && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedStudent(student)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedStudent === student && styles.filterButtonTextActive,
              ]}
            >
              {student.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={newMessage.trim() ? "#fff" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      {/* Student Info if filtered */}
      {selectedStudent && (
        <View style={styles.studentInfo}>
          <Text style={styles.studentInfoText}>
            Chatting with: {selectedStudent}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

// Separate style objects for different message types
const tutorMessageStyles = {
  senderName: {
    color: "rgba(255,255,255,0.8)",
  },
  timestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  messageText: {
    color: "#fff",
  },
};

const studentMessageStyles = {
  senderName: {
    color: "#666",
  },
  timestamp: {
    color: "#999",
  },
  messageText: {
    color: "#333",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  filterContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f4",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  tutorMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  studentMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
  },
  tutorSenderName: {
    color: "rgba(255,255,255,0.8)",
  },
  timestamp: {
    fontSize: 11,
  },
  tutorTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tutorMessageText: {
    color: "#fff",
  },
  unreadIndicator: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#f1f3f4",
  },
  studentInfo: {
    padding: 12,
    backgroundColor: "#e3f2fd",
    borderTopWidth: 1,
    borderTopColor: "#bbdefb",
  },
  studentInfoText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default CourseChat;
