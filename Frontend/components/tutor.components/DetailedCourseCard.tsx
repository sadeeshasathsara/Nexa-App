import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

interface DetailedCourseCardProps {
    course: Course;
    from?: string;
    onPress?: () => void;
}

const DetailedCourseCard: React.FC<DetailedCourseCardProps> = ({ course, from, onPress }) => {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push({
                pathname: `(tabs)/course_details/${course._id}`,
                params: { from: from || 'student' },
            });
        }
    };

    const truncateDescription = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return '#10b981';
            case 'intermediate': return '#f59e0b';
            case 'advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{ uri: course.imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{course.title}</Text>
                    {course.instructor && (
                        <Text style={styles.instructor}>by {course.instructor.fullName}</Text>
                    )}
                </View>

                <Text style={styles.description}>
                    {truncateDescription(course.description, 120)}
                </Text>

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.statText}>{course.rating.toFixed(1)} ({course.numReviews})</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="people" size={16} color="#3b82f6" />
                        <Text style={styles.statText}>{course.enrollments}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="time" size={16} color="#10b981" />
                        <Text style={styles.statText}>{course.durationWeeks}w</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) + '20', borderColor: getDifficultyColor(course.difficulty) }]}>
                        <Text style={[styles.difficultyText, { color: getDifficultyColor(course.difficulty) }]}>{course.difficulty}</Text>
                    </View>
                    <Text style={styles.category}>{course.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 160,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    content: {
        flex: 1,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 4,
        lineHeight: 24,
    },
    instructor: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500",
    },
    description: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: "#6b7280",
        fontWeight: "500",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: "600",
    },
    category: {
        fontSize: 12,
        color: "#6b7280",
        fontWeight: "500",
        textTransform: "uppercase",
    },
});

export { DetailedCourseCard };
export default DetailedCourseCard;
