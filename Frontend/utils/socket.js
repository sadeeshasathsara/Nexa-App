import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config/api";

let socket = null;

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

// Connect to WebSocket
export const connectWebSocket = async () => {
    const token = await getAuthToken();

    if (!token) {
        console.error("No token found, cannot connect WebSocket.");
        return null;
    }

    if (socket && socket.connected) {
        return socket;
    }

    socket = io(API_BASE_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
    });

    socket.on('connect', () => {
        console.log('Connected to WebSocket server:', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket:', reason);
    });

    socket.on('error', (errorMessage) => {
        console.error('Server WebSocket Error:', errorMessage);
    });

    return socket;
};

// Disconnect WebSocket
export const disconnectWebSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Get current socket instance
export const getSocket = () => socket;
