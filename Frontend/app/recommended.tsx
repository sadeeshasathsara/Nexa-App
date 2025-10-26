import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DetailedCourseCard from "../components/tutor.components/DetailedCourseCard";

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
    instructor: {
        _id: string;
        fullName: string;
    };
    lessons: any[];
    reviews: any[];
}

export default function RecommendedCoursesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const recommendedCourses: Course[] = JSON.parse(params.courses as string || '[]');

    const handleBack = () => {
        router.back();
    };

    const renderCourse = ({ item }: { item: Course }) => (
        <DetailedCourseCard course={item} from="student" />
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recommended for You</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            {recommendedCourses.length > 0 ? (
                <FlatList
                    data={recommendedCourses}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCourse}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={64} color="#d1d5db" />
                    <Text style={styles.emptyTitle}>No Recommendations</Text>
                    <Text style={styles.emptySubtitle}>
                        We don't have any course recommendations for you at the moment.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2937",
    },
    placeholder: {
        width: 40,
    },
    listContainer: {
        paddingVertical: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#374151",
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 24,
    },
});
