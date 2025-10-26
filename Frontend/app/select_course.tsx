import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config/api";

interface Course {
    _id: string;
    title: string;
    category: string;
    description: string;
    rating: number;
    numReviews: number;
    enrollments: number;
    durationWeeks: number;
    difficulty: string;
    imageUrl: string;
    lessons: any[];
    reviews: any[];
    createdAt: string;
    updatedAt: string;
}

export default function SelectCourse() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/my-courses`);
            const data = await response.json();
            if (data.success) {
                setCourses(data.data);
            } else {
                Alert.alert("Error", "Failed to fetch courses");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            Alert.alert("Error", "Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourseId(courseId);
    };

    const handleNext = () => {
        if (!selectedCourseId) {
            Alert.alert("Error", "Please select a course");
            return;
        }
        router.push({
            pathname: "/(tabs)/(quiz)",
            params: { courseId: selectedCourseId },
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/(tutor_tabs)")}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Select Course for Quiz</Text>
                <Text style={styles.subtitle}>Choose the course you want to create a quiz for</Text>
            </View>
            <ScrollView style={styles.scrollView}>

                <View style={styles.coursesList}>
                    {courses.map((course) => (
                        <TouchableOpacity
                            key={course._id}
                            style={[
                                styles.courseItem,
                                selectedCourseId === course._id && styles.courseItemSelected,
                            ]}
                            onPress={() => handleCourseSelect(course._id)}
                        >
                            <View style={styles.courseContent}>
                                <Text style={styles.courseTitle}>{course.title}</Text>
                                <Text style={styles.courseCategory}>{course.category}</Text>
                                <Text style={styles.courseDescription} numberOfLines={2}>
                                    {course.description}
                                </Text>
                                <View style={styles.courseStats}>
                                    <Text style={styles.statText}>Rating: {course.rating}</Text>
                                    <Text style={styles.statText}>Students: {course.enrollments}</Text>
                                    <Text style={styles.statText}>Lessons: {course.lessons.length}</Text>
                                </View>
                            </View>
                            <View style={styles.radioContainer}>
                                <View
                                    style={[
                                        styles.radio,
                                        selectedCourseId === course._id && styles.radioSelected,
                                    ]}
                                >
                                    {selectedCourseId === course._id && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.nextButton, !selectedCourseId && styles.nextButtonDisabled]}
                    onPress={handleNext}
                    disabled={!selectedCourseId}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 30,
        marginTop: 50,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        color: "#1e293b",
        marginLeft: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1e293b",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#64748b",
        textAlign: "center",
        marginTop: 100,
    },
    coursesList: {
        marginBottom: 30,
    },
    courseItem: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseItemSelected: {
        borderWidth: 2,
        borderColor: "#3b82f6",
    },
    courseContent: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: 4,
    },
    courseCategory: {
        fontSize: 14,
        color: "#3b82f6",
        marginBottom: 8,
    },
    courseDescription: {
        fontSize: 14,
        color: "#64748b",
        lineHeight: 20,
        marginBottom: 12,
    },
    courseStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statText: {
        fontSize: 12,
        color: "#64748b",
    },
    radioContainer: {
        marginLeft: 12,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#cbd5e1",
        justifyContent: "center",
        alignItems: "center",
    },
    radioSelected: {
        borderColor: "#3b82f6",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#3b82f6",
    },
    nextButton: {
        backgroundColor: "#3b82f6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    nextButtonDisabled: {
        backgroundColor: "#cbd5e1",
    },
    nextButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
