import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE_URL } from "../../../config/api";
import { Ionicons } from "@expo/vector-icons";

const LessonDetail: React.FC = () => {
    const { id, lesson, from, courseId } = useLocalSearchParams<{
        id: string;
        lesson: string;
        from: string;
        courseId: string;
    }>();
    const router = useRouter();

    const lessonData = lesson ? JSON.parse(lesson) : null;

    const handleBackPress = () => {
        if (from === 'student') {
            router.push(`/(tabs)/(student_tabs)/courses`);
        } else if (from === 'tutor') {
            router.push(`/(tabs)/(tutor_tabs)/courses`);
        } else {
            router.back();
        }
    };

    const handleMaterialPress = (material: any) => {
        // For now, open in browser. In a real app, you might use a PDF viewer or video player
        const url = `${API_BASE_URL}/api/files/${material.fileId}`;
        Linking.openURL(url);
    };

    if (!lessonData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Lesson not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.lessonTitle}>{lessonData.title}</Text>
                <Text style={styles.lessonDescription}>{lessonData.description}</Text>
                <Text style={styles.weekInfo}>Week {lessonData.weekNumber}</Text>
            </View>

            <View style={styles.materialsContainer}>
                <Text style={styles.materialsTitle}>Materials</Text>
                {lessonData.materials && lessonData.materials.length > 0 ? (
                    lessonData.materials.map((material: any) => (
                        <TouchableOpacity
                            key={material._id}
                            style={styles.materialItem}
                            onPress={() => handleMaterialPress(material)}
                        >
                            <View style={styles.materialInfo}>
                                <Text style={styles.materialTitle}>{material.title}</Text>
                                <Text style={styles.materialType}>{material.materialType}</Text>
                                <Text style={styles.materialFilename}>{material.filename}</Text>
                            </View>
                            <Text style={styles.viewText}>View</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noMaterials}>No materials available for this lesson.</Text>
                )}
            </View>

            {/* Floating Chatbot Button */}
            <TouchableOpacity
                style={styles.chatbotButton}
                onPress={() => router.push("/(chatbot)")}
            >
                <Ionicons name="chatbubbles-outline" size={24} color="#a43131ff" />
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    chatbotButton: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#667eea",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    backButton: {
        marginBottom: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "500",
    },
    lessonTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 8,
    },
    lessonDescription: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    weekInfo: {
        fontSize: 14,
        color: "#007AFF",
        fontWeight: "500",
    },
    materialsContainer: {
        padding: 16,
    },
    materialsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 16,
    },
    materialItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        marginBottom: 8,
    },
    materialInfo: {
        flex: 1,
    },
    materialTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    materialType: {
        fontSize: 14,
        color: "#007AFF",
        marginBottom: 2,
    },
    materialFilename: {
        fontSize: 12,
        color: "#666",
    },
    viewText: {
        fontSize: 14,
        color: "#007AFF",
        fontWeight: "500",
    },
    noMaterials: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#ff4444",
        textAlign: "center",
        marginTop: 20,
    },
});

export default LessonDetail;

export const screenOptions = {
    headerShown: false,
};
