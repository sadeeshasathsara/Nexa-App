import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../../config/api";

const CATEGORIES = [
    "Technology",
    "Mathematics",
    "Science",
    "Languages",
    "Business",
    "Arts",
    "Health",
    "Engineering",
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function CreateCourse() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [durationWeeks, setDurationWeeks] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // UI state
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);

    // Validation
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "",
        durationWeeks: "",
    });

    const validateForm = () => {
        const newErrors = {
            title: "",
            description: "",
            category: "",
            difficulty: "",
            durationWeeks: "",
        };

        let isValid = true;

        if (!title.trim()) {
            newErrors.title = "Course title is required";
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        }

        if (!category) {
            newErrors.category = "Please select a category";
            isValid = false;
        }

        if (!difficulty) {
            newErrors.difficulty = "Please select a difficulty level";
            isValid = false;
        }

        if (!durationWeeks.trim()) {
            newErrors.durationWeeks = "Duration is required";
            isValid = false;
        } else if (isNaN(Number(durationWeeks)) || Number(durationWeeks) <= 0) {
            newErrors.durationWeeks = "Duration must be a positive number";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreateCourse = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            const courseData: any = {
                title: title.trim(),
                description: description.trim(),
                category,
                difficulty,
                durationWeeks: Number(durationWeeks),
            };

            // Only include imageUrl if provided
            if (imageUrl.trim()) {
                courseData.imageUrl = imageUrl.trim();
            }

            console.log("📦 Course Creation Payload:", JSON.stringify(courseData, null, 2));

            const response = await fetch(`${API_BASE_URL}/api/courses/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add authorization header if needed
                },
                credentials: "include",
                body: JSON.stringify(courseData),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert("Success", "Course created successfully!", [
                    {
                        text: "OK",
                        onPress: () => {
                            // Navigate to the course details page or back to course list
                            router.push(`/(tabs)/course_details/${data.data._id}`);
                        },
                    },
                ]);
            } else {
                Alert.alert("Error", data.message || "Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            Alert.alert("Error", "Failed to create course. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create New Course</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Course Title */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        Course Title <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, errors.title && styles.inputError]}
                        placeholder="e.g., Introduction to Python Programming"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.title ? (
                        <Text style={styles.errorText}>{errors.title}</Text>
                    ) : null}
                </View>

                {/* Description */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        Description <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            errors.description && styles.inputError,
                        ]}
                        placeholder="Describe what students will learn in this course..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.description ? (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    ) : null}
                </View>

                {/* Category */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        Category <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                        style={[styles.dropdown, errors.category && styles.inputError]}
                        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                        <Text
                            style={[
                                styles.dropdownText,
                                !category && styles.dropdownPlaceholder,
                            ]}
                        >
                            {category || "Select a category"}
                        </Text>
                        <Ionicons
                            name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#64748b"
                        />
                    </TouchableOpacity>
                    {errors.category ? (
                        <Text style={styles.errorText}>{errors.category}</Text>
                    ) : null}

                    {showCategoryDropdown && (
                        <View style={styles.dropdownMenu}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setCategory(cat);
                                        setShowCategoryDropdown(false);
                                        setErrors({ ...errors, category: "" });
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            category === cat && styles.dropdownItemTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                    {category === cat && (
                                        <Ionicons name="checkmark" size={20} color="#3b82f6" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Difficulty */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        Difficulty Level <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                        style={[styles.dropdown, errors.difficulty && styles.inputError]}
                        onPress={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                    >
                        <Text
                            style={[
                                styles.dropdownText,
                                !difficulty && styles.dropdownPlaceholder,
                            ]}
                        >
                            {difficulty || "Select difficulty level"}
                        </Text>
                        <Ionicons
                            name={showDifficultyDropdown ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#64748b"
                        />
                    </TouchableOpacity>
                    {errors.difficulty ? (
                        <Text style={styles.errorText}>{errors.difficulty}</Text>
                    ) : null}

                    {showDifficultyDropdown && (
                        <View style={styles.dropdownMenu}>
                            {DIFFICULTY_LEVELS.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setDifficulty(level);
                                        setShowDifficultyDropdown(false);
                                        setErrors({ ...errors, difficulty: "" });
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            difficulty === level && styles.dropdownItemTextActive,
                                        ]}
                                    >
                                        {level}
                                    </Text>
                                    {difficulty === level && (
                                        <Ionicons name="checkmark" size={20} color="#3b82f6" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Duration */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        Duration (Weeks) <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, errors.durationWeeks && styles.inputError]}
                        placeholder="e.g., 8"
                        value={durationWeeks}
                        onChangeText={setDurationWeeks}
                        keyboardType="numeric"
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.durationWeeks ? (
                        <Text style={styles.errorText}>{errors.durationWeeks}</Text>
                    ) : null}
                </View>

                {/* Image URL (Optional) */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Course Image URL (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., https://example.com/image.jpg"
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        keyboardType="url"
                        autoCapitalize="none"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text style={styles.helperText}>
                        Leave blank to use a default image
                    </Text>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    style={[styles.createButton, isLoading && styles.createButtonDisabled]}
                    onPress={handleCreateCourse}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                            <Text style={styles.createButtonText}>Create Course</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 8,
    },
    required: {
        color: "#ef4444",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: "#1e293b",
    },
    inputError: {
        borderColor: "#ef4444",
    },
    textArea: {
        minHeight: 120,
        paddingTop: 12,
    },
    dropdown: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownText: {
        fontSize: 16,
        color: "#1e293b",
    },
    dropdownPlaceholder: {
        color: "#94a3b8",
    },
    dropdownMenu: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        marginTop: 8,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    dropdownItemText: {
        fontSize: 16,
        color: "#1e293b",
    },
    dropdownItemTextActive: {
        color: "#3b82f6",
        fontWeight: "600",
    },
    errorText: {
        fontSize: 14,
        color: "#ef4444",
        marginTop: 4,
    },
    helperText: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 4,
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b82f6",
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    createButtonDisabled: {
        backgroundColor: "#94a3b8",
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 8,
    },
});
