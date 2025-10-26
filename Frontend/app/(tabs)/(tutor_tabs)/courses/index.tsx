import React, { useState, useEffect, useRef } from "react";
import { FlatList, StyleSheet, View, Text, RefreshControl, Animated, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DetailedCourseCard from "../../../../components/tutor.components/DetailedCourseCard";
import { API_BASE_URL } from "../../../../config/api";

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
    instructor?: {
        _id: string;
        fullName: string;
    };
    lessons?: any[];
    reviews?: any[];
}

const SkeletonLoader = ({ width, height, borderRadius }: { width: number | string; height: number; borderRadius?: number }) => {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start(() => animate());
        };
        animate();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={{
                width: width as any,
                height,
                backgroundColor: '#e0e0e0',
                borderRadius: borderRadius || 8,
                opacity: fadeAnim,
            }}
        />
    );
};

const SkeletonCourseCard = () => (
    <View style={styles.skeletonCard}>
        <SkeletonLoader width="100%" height={150} borderRadius={8} />
        <View style={styles.skeletonHeader}>
            <SkeletonLoader width="80%" height={18} borderRadius={4} />
            <SkeletonLoader width="60%" height={14} borderRadius={4} />
        </View>
        <SkeletonLoader width="100%" height={40} borderRadius={4} />
        <View style={styles.skeletonStats}>
            <SkeletonLoader width={40} height={16} borderRadius={4} />
            <SkeletonLoader width={40} height={16} borderRadius={4} />
            <SkeletonLoader width={50} height={16} borderRadius={4} />
            <SkeletonLoader width={50} height={16} borderRadius={12} />
        </View>
    </View>
);

const CoursesPage = () => {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/my-courses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                },
            });
            const data = await response.json();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCourses();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Courses</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/(tabs)/(tutor_tabs)/courses/create")}
                >
                    <Ionicons name="add-circle" size={28} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <FlatList
                    data={Array.from({ length: 5 })}
                    renderItem={() => <SkeletonCourseCard />}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            ) : courses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={64} color="#cbd5e1" />
                    <Text style={styles.emptyText}>No courses yet</Text>
                    <Text style={styles.emptySubtext}>
                        Create your first course to get started
                    </Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.push("/(tabs)/(tutor_tabs)/courses/create")}
                    >
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.createButtonText}>Create Course</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={courses}
                    renderItem={({ item }) => <DetailedCourseCard course={item} from="tutor" />}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e293b",
    },
    addButton: {
        padding: 4,
    },
    listContent: {
        paddingVertical: 16,
    },
    skeletonCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    skeletonHeader: {
        marginTop: 12,
        marginBottom: 12,
        gap: 8,
    },
    skeletonStats: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
        marginBottom: 24,
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b82f6",
        paddingVertical: 14,
        paddingHorizontal: 24,
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
});

export default CoursesPage;
