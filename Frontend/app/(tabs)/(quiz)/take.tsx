import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../config/api";

interface Question {
    _id: string;
    questionText: string;
    questionType: "multipleChoice" | "trueFalse" | "shortAnswer";
    options: string[];
    answer: string;
}

interface QuizData {
    _id: string;
    title: string;
    difficulty: string;
    questions: Question[];
    settings: {
        allowRetakes: boolean;
        sendNotifications: boolean;
        showResults: boolean;
    };
}

export default function TakeQuizScreen() {
    const { quizId } = useLocalSearchParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`);
            const data = await response.json();
            if (data.success) {
                setQuiz(data.data);
            } else {
                Alert.alert("Error", "Failed to fetch quiz");
                router.back();
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            Alert.alert("Error", "Failed to fetch quiz");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        setSubmitting(true);
        // Here you would typically submit answers to an API
        // For now, just show a success message
        Alert.alert("Quiz Submitted", "Your answers have been submitted successfully!", [
            { text: "OK", onPress: () => router.back() }
        ]);
        setSubmitting(false);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.backButton} />
                    <View style={styles.skeletonTitle} />
                    <View style={styles.skeletonProgress} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.questionContainer}>
                        <View style={styles.skeletonQuestion} />
                        <View style={styles.skeletonOptions}>
                            <View style={styles.skeletonOption} />
                            <View style={styles.skeletonOption} />
                            <View style={styles.skeletonOption} />
                            <View style={styles.skeletonOption} />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.skeletonNavButton} />
                    <View style={styles.skeletonSubmitButton} />
                </View>
            </View>
        );
    }

    if (!quiz) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Quiz not found</Text>
            </View>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.title}>{quiz.title}</Text>
                <Text style={styles.progress}>
                    {currentQuestionIndex + 1} / {quiz.questions.length}
                </Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

                    {currentQuestion.questionType === "multipleChoice" && (
                        <View style={styles.optionsContainer}>
                            {currentQuestion.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        answers[currentQuestion._id] === option && styles.selectedOption
                                    ]}
                                    onPress={() => handleAnswer(currentQuestion._id, option)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        answers[currentQuestion._id] === option && styles.selectedOptionText
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {currentQuestion.questionType === "trueFalse" && (
                        <View style={styles.trueFalseContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.trueFalseButton,
                                    answers[currentQuestion._id] === "True" && styles.selectedTrueFalse
                                ]}
                                onPress={() => handleAnswer(currentQuestion._id, "True")}
                            >
                                <Text style={[
                                    styles.trueFalseText,
                                    answers[currentQuestion._id] === "True" && styles.selectedTrueFalseText
                                ]}>
                                    True
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.trueFalseButton,
                                    answers[currentQuestion._id] === "False" && styles.selectedTrueFalse
                                ]}
                                onPress={() => handleAnswer(currentQuestion._id, "False")}
                            >
                                <Text style={[
                                    styles.trueFalseText,
                                    answers[currentQuestion._id] === "False" && styles.selectedTrueFalseText
                                ]}>
                                    False
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {currentQuestion.questionType === "shortAnswer" && (
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your answer"
                            value={answers[currentQuestion._id] || ""}
                            onChangeText={(text) => handleAnswer(currentQuestion._id, text)}
                            multiline
                        />
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledText]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                {isLastQuestion ? (
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {submitting ? "Submitting..." : "Submit Quiz"}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.navButton} onPress={handleNext}>
                        <Text style={styles.navButtonText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
    },
    progress: {
        fontSize: 14,
        color: "#64748b",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    questionContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "normal",
        color: "#1e293b",
        marginBottom: 20,
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedOption: {
        backgroundColor: "#dbeafe",
        borderColor: "#3b82f6",
    },
    optionText: {
        fontSize: 16,
        color: "#475569",
    },
    selectedOptionText: {
        color: "#1e40af",
        fontWeight: "600",
    },
    trueFalseContainer: {
        flexDirection: "row",
        gap: 12,
    },
    trueFalseButton: {
        flex: 1,
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedTrueFalse: {
        backgroundColor: "#dbeafe",
        borderColor: "#3b82f6",
    },
    trueFalseText: {
        fontSize: 16,
        color: "#475569",
        fontWeight: "600",
    },
    selectedTrueFalseText: {
        color: "#1e40af",
    },
    textInput: {
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    },
    navButton: {
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 100,
        alignItems: "center",
    },
    navButtonText: {
        fontSize: 16,
        color: "#475569",
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "#e2e8f0",
        opacity: 0.6,
    },
    disabledText: {
        color: "#94a3b8",
    },
    submitButton: {
        backgroundColor: "#3b82f6",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 120,
        alignItems: "center",
    },
    submitButtonText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "600",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#64748b",
    },
    errorText: {
        fontSize: 18,
        color: "#dc2626",
        textAlign: "center",
    },
    skeletonTitle: {
        flex: 1,
        height: 18,
        backgroundColor: "#e2e8f0",
        borderRadius: 4,
    },
    skeletonProgress: {
        height: 14,
        width: 40,
        backgroundColor: "#e2e8f0",
        borderRadius: 4,
    },
    skeletonQuestion: {
        height: 60,
        backgroundColor: "#e2e8f0",
        borderRadius: 8,
        marginBottom: 20,
    },
    skeletonOptions: {
        gap: 12,
    },
    skeletonOption: {
        height: 50,
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
    },
    skeletonNavButton: {
        height: 44,
        width: 100,
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
    },
    skeletonSubmitButton: {
        height: 44,
        width: 120,
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
    },
});
