import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import io, { Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

import { API_BASE_URL } from "../../config/api";
import { useLocalSearchParams } from "expo-router";

interface Message {
  id: string;
  text: string;
  originalText?: string;
  timestamp: Date;
  sender: "tutor" | "student";
  studentName?: string;
  read: boolean;
  userId?: string;
}

interface TypingUser {
  userId: string;
  fullName: string;
}

const CourseChat = () => {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('en');

  // Refs
  const flatListRef = useRef<FlatList<any>>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousLanguageRef = useRef<string>('en');

  // ==================== STABLE UTILITY FUNCTIONS ====================

  // Secure token retrieval
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) return token;
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error retrieving auth token:", error);
      return null;
    }
  }, []);

  // Get current user ID from token
  const getCurrentUserId = useCallback(async (): Promise<string | null> => {
    try {
      const token = await getAuthToken();
      if (!token) return null;
      const decoded: any = jwtDecode(token);
      return decoded.userId || decoded.id || decoded._id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [getAuthToken]);

  // Message persistence
  const saveMessagesToStorage = useCallback(async (messagesToSave: Message[]) => {
    try {
      await AsyncStorage.setItem(`chat_${courseId}`, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error("Error saving messages to storage:", error);
    }
  }, [courseId]);

  const loadMessagesFromStorage = useCallback(async (): Promise<Message[]> => {
    try {
      const stored = await AsyncStorage.getItem(`chat_${courseId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading messages from storage:", error);
      return [];
    }
  }, [courseId]);

  // Translate message using Google Translate API
  const translateMessage = useCallback(async (text: string, targetLang: string): Promise<{ translated: string; original: string }> => {
    if (targetLang === 'en') {
      return { translated: text, original: text };
    }
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      const translatedText = data[0][0][0];
      return { translated: translatedText, original: text };
    } catch (error) {
      console.error("Translation error:", error);
      return { translated: text, original: text };
    }
  }, []);

  // Fetch preferred language from API
  const fetchPreferredLanguage = useCallback(async (): Promise<string> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token available for language fetch");
        return 'en';
      }

      const response = await fetch(`${API_BASE_URL}/api/users/language`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data.preferredLanguage || 'en';
      } else {
        console.error("Failed to fetch preferred language:", data.message);
        return 'en';
      }
    } catch (error) {
      console.error("Error fetching preferred language:", error);
      return 'en';
    }
  }, [getAuthToken]);

  // Fetch chat history from API
  const fetchChatHistory = useCallback(async (language: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/${courseId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);

        const transformedMessages: Message[] = await Promise.all(
          data.data.reverse().map(async (msg: any) => {
            const { translated, original } = await translateMessage(msg.message, language);
            return {
              id: msg._id,
              text: translated,
              originalText: original,
              timestamp: new Date(msg.createdAt),
              sender: msg.sender._id === userId ? "tutor" : "student",
              studentName: msg.sender.fullName,
              read: false,
              userId: msg.sender._id,
            };
          })
        );

        setMessages(transformedMessages);
        await saveMessagesToStorage(transformedMessages);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      const localMessages = await loadMessagesFromStorage();
      setMessages(localMessages);
    }
  }, [getAuthToken, courseId, getCurrentUserId, translateMessage, saveMessagesToStorage, loadMessagesFromStorage]);

  // ==================== MESSAGE HANDLERS ====================

  // Send pending messages when reconnected
  const sendPendingMessages = useCallback(() => {
    if (!socket || !isConnected || pendingMessages.length === 0) return;

    setMessages(prev => prev.filter(msg => !msg.id.startsWith('pending_')));

    pendingMessages.forEach((message) => {
      socket.emit("sendMessage", {
        message: message.text,
        courseId,
      });
    });

    setPendingMessages([]);
  }, [socket, isConnected, pendingMessages, courseId]);

  // Handle text input change - STABLE, doesn't cause re-renders
  const handleTextChange = useCallback((text: string) => {
    setNewMessage(text);

    if (socket && isConnected) {
      socket.emit("typing", { courseId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (socket && isConnected) {
          socket.emit("stopTyping", { courseId });
        }
      }, 2000);
    }
  }, [socket, isConnected, courseId]);

  // Send message
  const sendMessage = useCallback(() => {
    if (newMessage.trim() === "" || !socket) return;

    const messageText = newMessage.trim();
    const messageData = {
      message: messageText,
      courseId,
    };

    if (isConnected) {
      socket.emit("sendMessage", messageData);
    } else {
      const pendingMessage: Message = {
        id: `pending_${Date.now()}`,
        text: messageText,
        originalText: messageText,
        timestamp: new Date(),
        sender: "tutor",
        read: false,
      };
      setPendingMessages(prev => [...prev, pendingMessage]);
      setMessages(prev => [...prev, pendingMessage]);
    }

    setNewMessage("");

    if (socket && isConnected) {
      socket.emit("stopTyping", { courseId });
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [newMessage, socket, isConnected, courseId]);

  // Mark message as read
  const markAsRead = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );

    if (socket && isConnected) {
      socket.emit("markAsRead", { messageId, courseId });
    }
  }, [socket, isConnected, courseId]);

  // ==================== EFFECTS ====================

  // Initialize chat (runs once on mount)
  useEffect(() => {
    let mounted = true;
    let socketInstance: Socket | null = null;

    const initializeChat = async () => {
      // Load preferred language first
      const language = await fetchPreferredLanguage();
      if (!mounted) return;

      setPreferredLanguage(language);
      previousLanguageRef.current = language;

      // Load local messages and re-translate if necessary
      const localMessages = await loadMessagesFromStorage();
      const reTranslatedLocalMessages = await Promise.all(
        localMessages.map(async (msg) => {
          if (msg.originalText) {
            const { translated } = await translateMessage(msg.originalText, language);
            return { ...msg, text: translated };
          }
          return msg;
        })
      );
      if (!mounted) return;
      setMessages(reTranslatedLocalMessages);

      // Fetch latest history
      await fetchChatHistory(language);
      if (!mounted) return;

      // Get auth token
      const token = await getAuthToken();
      if (!token) {
        Alert.alert("Authentication Error", "Please log in again.");
        return;
      }

      // Initialize socket connection
      socketInstance = io(API_BASE_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });

      socketInstance.on("connect", () => {
        if (!mounted) return;
        setIsConnected(true);
        socketInstance?.emit("joinRoom", courseId);
      });

      socketInstance.on("newMessage", async (message: any) => {
        if (!mounted) return;

        const userId = currentUserId || await getCurrentUserId();
        const { translated, original } = await translateMessage(message.message, previousLanguageRef.current);
        const newMsg: Message = {
          id: message._id,
          text: translated,
          originalText: original,
          timestamp: new Date(message.createdAt),
          sender: message.sender._id === userId ? "tutor" : "student",
          studentName: message.sender.fullName,
          read: false,
          userId: message.sender._id,
        };

        setMessages((prev) => {
          const exists = prev.find(msg => msg.id === newMsg.id);
          if (exists) return prev;
          const updated = [...prev, newMsg];
          saveMessagesToStorage(updated);
          return updated;
        });

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      socketInstance.on("messageRead", (messageId: string) => {
        if (!mounted) return;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
        );
      });

      socketInstance.on("userTyping", (data: TypingUser) => {
        if (!mounted) return;
        setTypingUsers((prev) => {
          const exists = prev.find(user => user.userId === data.userId);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        });
      });

      socketInstance.on("userStopTyping", (userId: string) => {
        if (!mounted) return;
        setTypingUsers((prev) => prev.filter(user => user.userId !== userId));
      });

      socketInstance.on("disconnect", () => {
        if (!mounted) return;
        setIsConnected(false);
        setTypingUsers([]);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        if (!mounted) return;
        setIsConnected(false);
      });

      if (mounted) {
        setSocket(socketInstance);
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      if (socketInstance) {
        socketInstance.emit("leaveRoom", courseId);
        socketInstance.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [courseId]); // Only courseId as dependency

  // Send pending messages when connection is restored
  useEffect(() => {
    if (isConnected && socket && pendingMessages.length > 0) {
      sendPendingMessages();
    }
  }, [isConnected, socket, pendingMessages, sendPendingMessages]);

  // ==================== COMPUTED VALUES ====================

  // Filter messages based on selected filter - Memoized
  const filteredMessages = useMemo(() => {
    return selectedStudent === "instructor"
      ? messages.filter((msg) => msg.sender === "tutor")
      : messages;
  }, [selectedStudent, messages]);

  // ==================== RENDER HELPERS ====================

  const formatTime = useCallback((timestamp: Date) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatDate = useCallback((timestamp: Date) => {
    if (!timestamp) return "";
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
  }, []);

  const renderMessage = useCallback(({
    item,
    index,
  }: {
    item: Message;
    index: number;
  }) => {
    const showDate =
      index === 0 ||
      formatDate(item.timestamp) !== formatDate(filteredMessages[index - 1]?.timestamp);

    const isTutor = item.sender === "tutor";

    return (
      <View key={item.id}>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        )}

        <View style={[
          styles.messageRow,
          isTutor ? styles.tutorMessageRow : styles.studentMessageRow
        ]}>
          {!isTutor && (
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.studentName?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            </View>
          )}

          <View style={[
            styles.messageBubble,
            isTutor ? styles.tutorBubble : styles.studentBubble
          ]}>
            {!isTutor && item.studentName && (
              <Text style={styles.senderName}>{item.studentName}</Text>
            )}

            <Text style={[
              styles.messageText,
              isTutor ? styles.tutorMessageText : styles.studentMessageText
            ]}>
              {item.text}
            </Text>

            <View style={styles.messageFooter}>
              <Text style={[
                styles.timestamp,
                isTutor ? styles.tutorTimestamp : styles.studentTimestamp
              ]}>
                {formatTime(item.timestamp)}
              </Text>
              {isTutor && (
                <Ionicons
                  name="checkmark-done"
                  size={14}
                  color={item.read ? "#34C759" : "#999"}
                  style={styles.readIndicator}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }, [formatDate, formatTime, filteredMessages]);

  // ==================== MAIN COMPONENT ====================

  const ChatContent = useCallback(() => (
    <KeyboardAvoidingView
      style={[styles.container, isFullScreen && styles.fullScreenContainer]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header with Connection Status */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.connectionIndicator, isConnected ? styles.connected : styles.disconnected]} />
          <Text style={styles.headerTitle}>Course Chat</Text>
        </View>
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setIsFullScreen(!isFullScreen)}
        >
          <Ionicons
            name={isFullScreen ? "contract" : "expand"}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

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

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedStudent === "instructor" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedStudent("instructor")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedStudent === "instructor" && styles.filterButtonTextActive,
            ]}
          >
            Instructor
          </Text>
        </TouchableOpacity>
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

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>
            {typingUsers.length === 1
              ? `${typingUsers[0].fullName} is typing...`
              : `${typingUsers.length} people are typing...`
            }
          </Text>
        </View>
      )}

      {/* Offline Indicator */}
      {!isConnected && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>
            {pendingMessages.length > 0
              ? `Offline - ${pendingMessages.length} message(s) queued`
              : "Offline - Messages will be sent when reconnected"
            }
          </Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={handleTextChange}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          blurOnSubmit={false}
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
  ), [isFullScreen, isConnected, selectedStudent, filteredMessages, renderMessage, typingUsers, pendingMessages, newMessage, handleTextChange, sendMessage]);

  return (
    <View style={styles.wrapper}>
      <ChatContent />
      <Modal
        visible={isFullScreen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <ChatContent />
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  fullScreenContainer: {
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connected: {
    backgroundColor: "#34C759",
  },
  disconnected: {
    backgroundColor: "#FF3B30",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  fullScreenButton: {
    padding: 8,
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
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  tutorMessageRow: {
    justifyContent: "flex-end",
  },
  studentMessageRow: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 18,
  },
  tutorBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  studentBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tutorMessageText: {
    color: "#fff",
  },
  studentMessageText: {
    color: "#333",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  tutorTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  studentTimestamp: {
    color: "#999",
  },
  readIndicator: {
    marginLeft: 4,
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
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
  },
  typingText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  offlineIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff3cd",
    borderTopWidth: 1,
    borderTopColor: "#ffeaa7",
  },
  offlineText: {
    fontSize: 12,
    color: "#856404",
    textAlign: "center",
  },
});

export default CourseChat;
