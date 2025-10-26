import React, { useState, useEffect, useRef } from "react";
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
  Alert,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../../config/api";
import { connectWebSocket } from "../../../utils/socket";
import MarkdownDisplay from "react-native-markdown-display";

// Typing indicator component with animated dots
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -10,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ];

    animations.forEach(anim => anim.start());

    return () => animations.forEach(anim => anim.stop());
  }, []);

  return (
    <View style={styles.typingIndicatorContainer}>
      <Animated.View
        style={[
          styles.typingDot,
          { transform: [{ translateY: dot1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { transform: [{ translateY: dot2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { transform: [{ translateY: dot3 }] },
        ]}
      />
    </View>
  );
};

// Animated message bubble component
const MessageBubble = ({ message, isUser }: { message: any; isUser: boolean }) => {
  const slideAnim = useRef(new Animated.Value(isUser ? 50 : -50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Animated.View
      style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {!isUser && (
        <View style={styles.botAvatarContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
            }}
            style={styles.botAvatar}
          />
        </View>
      )}
      <View style={[styles.messageBubble, isUser ? styles.userMessage : styles.botMessage]}>
        <MarkdownDisplay
          style={{
            body: { ...styles.messageText, ...(isUser ? styles.userMessageText : styles.botMessageText) },
          }}
        >
          {message.text}
        </MarkdownDisplay>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
};

export default function ChatbotScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string, text: string, isUser: boolean, timestamp: Date }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    "How do I start a new course?",
    "Explain wireframing in UI design?",
    "What is the latest news in tech?",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatMessages.length > 0 || isLoading) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages, isLoading]);

  // Secure token retrieval
  const getAuthToken = async () => {
    try {
      // Try SecureStore first (more secure)
      const token = await SecureStore.getItemAsync("authToken");
      if (token) return token;

      // Fallback to AsyncStorage
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error retrieving auth token:", error);
      return null;
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeSocket = async () => {
      const newSocket = await connectWebSocket();
      if (newSocket) {
        setSocket(newSocket);
        setIsConnected(newSocket.connected);

        newSocket.on('connect', () => {
          setIsConnected(true);
          console.log('Connected to WebSocket for chatbot');
        });

        newSocket.on('disconnect', () => {
          setIsConnected(false);
          console.log('Disconnected from WebSocket');
        });

        newSocket.on('error', (errorMessage: any) => {
          console.error('WebSocket Error:', errorMessage);
          Alert.alert("Connection Error", errorMessage);
        });
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Send message to bot
  const sendMessageToBot = async (messageText: string) => {
    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!courseId) {
        Alert.alert("Error", "Course ID is required to use the chatbot.");
        setIsLoading(false);
        return;
      }

      const token = await getAuthToken();
      if (!token) {
        Alert.alert("Authentication Error", "Please log in again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/bot/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        Alert.alert("Error", `Failed to send message: ${response.status} ${response.statusText}`);
        setIsLoading(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Unexpected response type:", contentType);
        Alert.alert("Error", "Server returned unexpected response format");
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        const botMessageId = (Date.now() + 1).toString();
        const botMessage = {
          id: botMessageId,
          text: result.data.response,
          isUser: false,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
        console.log('Bot response:', result.data.response);
      } else {
        console.error("Failed to get bot response:", result.message);
        Alert.alert("Error", result.message || "Failed to get response from bot");
      }
    } catch (error) {
      console.error('Error sending message to bot:', error);
      Alert.alert("Error", "Failed to send message to bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessageToBot(message.trim());
      setMessage("");
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    sendMessageToBot(question);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chatbot</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Chat Content */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContainer}
          style={styles.chatScrollView}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatMessages.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
                }}
                style={styles.botImage}
              />

              <Text style={styles.welcomeText}>Welcome to the new Chatbot</Text>

              <View style={styles.quickReplies}>
                {quickQuestions.map((q, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickButton}
                    onPress={() => handleQuickQuestion(q)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.messagesContainer}>
              {chatMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isUser={msg.isUser} />
              ))}
              {isLoading && (
                <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
                  <View style={styles.botAvatarContainer}>
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
                      }}
                      style={styles.botAvatar}
                    />
                  </View>
                  <View style={[styles.messageBubble, styles.botMessage]}>
                    <TypingIndicator />
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />

            <TouchableOpacity style={styles.attachIconButton}>
              <Ionicons name="attach-outline" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.micIconButton}>
              <Ionicons name="mic-outline" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSend} style={styles.sendIconButton}>
              <Ionicons name="send" size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  menuButton: {
    padding: 4,
  },
  chatScrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  botImage: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
  quickReplies: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  quickButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#4A90E2",
  },
  quickText: {
    color: "#4A90E2",
    fontWeight: "500",
    fontSize: 15,
    textAlign: "center",
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
    maxWidth: "85%",
  },
  userMessageWrapper: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  botMessageWrapper: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  botAvatarContainer: {
    marginRight: 10,
    marginBottom: 2,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: "100%",
  },
  userMessage: {
    backgroundColor: "#4A90E2",
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  botTimestamp: {
    color: "#999",
  },
  typingIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    color: "#000",
    fontSize: 15,
    paddingVertical: 8,
  },
  attachIconButton: {
    padding: 4,
  },
  micIconButton: {
    padding: 4,
  },
  sendIconButton: {
    padding: 4,
  },
});
