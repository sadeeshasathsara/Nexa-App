import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function ChatbotScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const quickQuestions = [
    "How do I start a new course?",
    "Explain wireframing in UI design?",
    "What is the latest news in tech?",
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <LinearGradient colors={["#f9fbff", "#ffffff"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chatbot</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Chat Content */}
        <ScrollView contentContainerStyle={styles.chatContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
            }}
            style={styles.botImage}
          />

          <Text style={styles.welcomeText}>Welcome to the new Chatbot</Text>

          <View style={styles.quickReplies}>
            {quickQuestions.map((q, index) => (
              <TouchableOpacity key={index} style={styles.quickButton}>
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Menu */}
        <View style={styles.bottomMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="search" size={16} color="#667eea" />
            <Text style={styles.menuText}>Find Session</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={16} color="#667eea" />
            <Text style={styles.menuText}>Find Tutor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="book-outline" size={16} color="#667eea" />
            <Text style={styles.menuText}>Course Material</Text>
          </TouchableOpacity>
        </View>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity>
            <Ionicons name="mic-outline" size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={24} color="#667eea" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  chatContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  botImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  quickReplies: {
    alignItems: "center",
  },
  quickButton: {
    backgroundColor: "#e6ecff",
    borderColor: "#667eea",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  quickText: {
    color: "#667eea",
    fontWeight: "500",
    fontSize: 14,
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  menuText: {
    color: "#667eea",
    fontSize: 12,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f1f3f6",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: "#333",
  },
});
