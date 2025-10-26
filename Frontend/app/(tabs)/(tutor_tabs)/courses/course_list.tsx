import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../../config/api";
import { DetailedCourseCard } from "../../../../components/tutor.components/DetailedCourseCard";

interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    durationWeeks: number;
    imageUrl: string;
    rating: number;
    numReviews: number;
    enrollments: number;
    lessons?: any[];
    reviews?: any[];
    instructor?: {
        _id: string;
        fullName: string;
    };
}

export default function CourseList() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/courses/tutor/my-courses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Add authorization header if needed
                },
            });
            const data = await response.json();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            Alert.alert("Error", "Failed to load courses");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Courses</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Create Course Button */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push("/(tabs)/(tutor_tabs)/courses/create")}
            >
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.createButtonText}>Create New Course</Text>
            </TouchableOpacity>

            {/* Course List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                    </View>
                ) : courses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={64} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No courses yet</Text>
                        <Text style={styles.emptySubtext}>
                            Create your first course to get started
                        </Text>
                    </View>
                ) : (
                    <View style={styles.courseList}>
                        {courses.map((course) => (
                            <DetailedCourseCard
                                key={course._id}
                                course={course}
                                onPress={() =>
                                    router.push(`/(tabs)/course_details/${course._id}`)
                                }
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1e293b",
    },
    placeholder: {
        width: 40,
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b82f6",
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1e293b",
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 8,
        textAlign: "center",
    },
    courseList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
