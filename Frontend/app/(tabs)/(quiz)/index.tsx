import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Lesson {
  id: string;
  title: string;
  pages: number;
  size: string;
  updated: string;
  selected: boolean;
}

interface Document {
  id: string;
  name: string;
  size: string;
  selected: boolean;
}

interface QuizSettings {
  numberOfQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
  };
}

const QuizGenerator: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Introduction to React",
      pages: 24,
      size: "2.4 MB",
      updated: "2 days ago",
      selected: false,
    },
    {
      id: "2",
      title: "State Management",
      pages: 18,
      size: "18 MB",
      updated: "1 week ago",
      selected: false,
    },
    {
      id: "3",
      title: "Component Lifecycle",
      pages: 32,
      size: "31 MB",
      updated: "3 days ago",
      selected: false,
    },
    {
      id: "4",
      title: "Hooks and Context",
      pages: 28,
      size: "2.7 MB",
      updated: "5 days ago",
      selected: false,
    },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Advanced Topics.pdf",
      size: "12 MB",
      selected: false,
    },
  ]);

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    numberOfQuestions: 10,
    difficulty: "Medium",
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: false,
    },
  });

  const toggleLessonSelection = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, selected: !lesson.selected }
          : lesson
      )
    );
  };

  const toggleAllLessons = () => {
    const allSelected = lessons.every((lesson) => lesson.selected);
    setLessons((prev) =>
      prev.map((lesson) => ({ ...lesson, selected: !allSelected }))
    );
  };

  const toggleDocumentSelection = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  const handleNumberOfQuestionsChange = (value: number) => {
    setQuizSettings((prev) => ({
      ...prev,
      numberOfQuestions: value,
    }));
  };

  const handleDifficultyChange = (difficulty: "Easy" | "Medium" | "Hard") => {
    setQuizSettings((prev) => ({
      ...prev,
      difficulty,
    }));
  };

  const handleQuestionTypeToggle = (
    type: keyof typeof quizSettings.questionTypes
  ) => {
    setQuizSettings((prev) => ({
      ...prev,
      questionTypes: {
        ...prev.questionTypes,
        [type]: !prev.questionTypes[type],
      },
    }));
  };

  const handleGenerateQuiz = () => {
    const selectedLessons = lessons.filter((lesson) => lesson.selected);
    const selectedDocs = documents.filter((doc) => doc.selected);

    if (selectedLessons.length === 0 && selectedDocs.length === 0) {
      Alert.alert("Error", "Please select at least one lesson or document.");
      return;
    }
    router.push("/(quiz)/review");
    Alert.alert(
      "Quiz Generated",
      `Creating quiz with ${quizSettings.numberOfQuestions} questions from ${selectedLessons.length} lessons and ${selectedDocs.length} documents.`
    );

    // Here you would typically navigate to the quiz or generate the quiz content
  };

  const selectedLessonsCount = lessons.filter(
    (lesson) => lesson.selected
  ).length;
  const selectedDocumentsCount = documents.filter((doc) => doc.selected).length;
  const totalQuestions = quizSettings.numberOfQuestions;

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lessons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Lessons List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Lessons</Text>
        {filteredLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonItem}
            onPress={() => toggleLessonSelection(lesson.id)}
          >
            <View style={styles.lessonContent}>
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <View
                  style={[
                    styles.checkbox,
                    lesson.selected && styles.checkboxSelected,
                  ]}
                >
                  {lesson.selected && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonDetail}>
                  Lesson {lesson.id} - {lesson.pages} pages
                </Text>
                <Text style={styles.lessonDetail}>
                  {lesson.size} ▼ Updated {lesson.updated}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Select All */}
      <TouchableOpacity
        style={styles.selectAllButton}
        onPress={toggleAllLessons}
      >
        <Text style={styles.selectAllText}>Select all lessons</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Additional Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Documents</Text>

        <View style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>Upload Documents</Text>
          <Text style={styles.uploadSubtitle}>PDF, DOC, DOCX up to 10MB</Text>
          <TouchableOpacity style={styles.chooseFilesButton}>
            <Text style={styles.chooseFilesText}>Choose Files</Text>
          </TouchableOpacity>
        </View>

        {documents.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.documentItem}
            onPress={() => toggleDocumentSelection(doc.id)}
          >
            <View style={styles.documentContent}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <Text style={styles.documentSize}>{doc.size}</Text>
            </View>
            <View
              style={[styles.checkbox, doc.selected && styles.checkboxSelected]}
            >
              {doc.selected && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quiz Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quiz Settings</Text>

        {/* Number of Questions */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Number of Questions</Text>
          <View style={styles.questionsSelector}>
            {[5, 10, 15, 20].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.questionOption,
                  quizSettings.numberOfQuestions === num &&
                    styles.questionOptionSelected,
                ]}
                onPress={() => handleNumberOfQuestionsChange(num)}
              >
                <Text
                  style={[
                    styles.questionOptionText,
                    quizSettings.numberOfQuestions === num &&
                      styles.questionOptionTextSelected,
                  ]}
                >
                  {num} questions
                </Text>
                {quizSettings.numberOfQuestions === num && (
                  <Ionicons name="checkmark" size={16} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Level */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Difficulty Level</Text>
          <View style={styles.difficultySelector}>
            {(["Easy", "Medium", "Hard"] as const).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyOption,
                  quizSettings.difficulty === difficulty &&
                    styles.difficultyOptionSelected,
                ]}
                onPress={() => handleDifficultyChange(difficulty)}
              >
                <Text
                  style={[
                    styles.difficultyOptionText,
                    quizSettings.difficulty === difficulty &&
                      styles.difficultyOptionTextSelected,
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question Types */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Question Types</Text>
          <View style={styles.questionTypes}>
            <TouchableOpacity
              style={styles.questionTypeItem}
              onPress={() => handleQuestionTypeToggle("multipleChoice")}
            >
              <View
                style={[
                  styles.checkbox,
                  quizSettings.questionTypes.multipleChoice &&
                    styles.checkboxSelected,
                ]}
              >
                {quizSettings.questionTypes.multipleChoice && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.questionTypeText}>Multiple Choice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionTypeItem}
              onPress={() => handleQuestionTypeToggle("trueFalse")}
            >
              <View
                style={[
                  styles.checkbox,
                  quizSettings.questionTypes.trueFalse &&
                    styles.checkboxSelected,
                ]}
              >
                {quizSettings.questionTypes.trueFalse && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.questionTypeText}>True/False</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionTypeItem}
              onPress={() => handleQuestionTypeToggle("shortAnswer")}
            >
              <View
                style={[
                  styles.checkbox,
                  quizSettings.questionTypes.shortAnswer &&
                    styles.checkboxSelected,
                ]}
              >
                {quizSettings.questionTypes.shortAnswer && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.questionTypeText}>Short Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          {selectedLessonsCount} lessons selected • {selectedDocumentsCount}{" "}
          additional document • {totalQuestions} questions
        </Text>
      </View>

      {/* Generate Quiz Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateQuiz}
      >
        <Text style={styles.generateButtonText}>Generate Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  lessonItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 12,
  },
  lessonDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lessonDetail: {
    fontSize: 14,
    color: "#666",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  selectAllButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  selectAllText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 16,
  },
  uploadSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  chooseFilesButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
  },
  chooseFilesText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  documentContent: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 14,
    color: "#666",
  },
  settingRow: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  questionsSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  questionOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  questionOptionSelected: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  questionOptionText: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  questionOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "500",
  },
  difficultySelector: {
    flexDirection: "row",
    gap: 8,
  },
  difficultyOption: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  difficultyOptionSelected: {
    backgroundColor: "#007AFF",
  },
  difficultyOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  difficultyOptionTextSelected: {
    color: "#fff",
  },
  questionTypes: {
    gap: 12,
  },
  questionTypeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionTypeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  summarySection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QuizGenerator;
