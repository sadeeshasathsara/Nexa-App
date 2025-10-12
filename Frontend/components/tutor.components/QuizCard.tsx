// components/QuizCard.tsx
import { useState } from "react";

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  explanation?: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onAnswerSubmit?: (quizId: number, selectedOption: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onAnswerSubmit }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const styles = {
    quizCard: {
      border: "1px solid #e1e5e9",
      borderRadius: "12px",
      padding: "24px",
      margin: "16px 0",
      background: "white",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "box-shadow 0.3s ease",
    },
    quizHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "20px",
    },
    quizQuestion: {
      margin: 0,
      color: "#2d3748",
      fontSize: "1.2rem",
      lineHeight: 1.4,
      flex: 1,
    },
    quizCategory: {
      background: "#edf2f7",
      color: "#4a5568",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 600,
      marginLeft: "12px",
    },
    quizOptions: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      marginBottom: "20px",
    },
    quizOption: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: "white",
    },
    optionLetter: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      background: "#e2e8f0",
      borderRadius: "4px",
      marginRight: "12px",
      fontWeight: 600,
      fontSize: "0.9rem",
    },
    optionText: {
      flex: 1,
    },
    submitBtn: {
      background: "#4299e1",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.2s ease",
    },
    submitBtnDisabled: {
      background: "#cbd5e0",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "not-allowed",
    },
    resultSection: {
      textAlign: "center" as const,
    },
    resultMessage: {
      fontSize: "1.1rem",
      fontWeight: 600,
      marginBottom: "12px",
      padding: "8px 16px",
      borderRadius: "8px",
    },
    resultMessageCorrect: {
      fontSize: "1.1rem",
      fontWeight: 600,
      marginBottom: "12px",
      padding: "8px 16px",
      borderRadius: "8px",
      color: "#22543d",
      background: "#c6f6d5",
    },
    resultMessageIncorrect: {
      fontSize: "1.1rem",
      fontWeight: 600,
      marginBottom: "12px",
      padding: "8px 16px",
      borderRadius: "8px",
      color: "#742a2a",
      background: "#fed7d7",
    },
    explanation: {
      background: "#edf2f7",
      padding: "12px 16px",
      borderRadius: "8px",
      margin: "12px 0",
      fontStyle: "italic",
      color: "#4a5568",
    },
    resetBtn: {
      background: "#718096",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.2s ease",
    },
  };

  const handleOptionSelect = (optionIndex: number): void => {
    if (!isSubmitted) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmit = (): void => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
      if (onAnswerSubmit) {
        onAnswerSubmit(quiz.id, selectedOption);
      }
    }
  };

  const handleReset = (): void => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const getOptionStyle = (optionIndex: number): React.CSSProperties => {
    const baseStyle = { ...styles.quizOption };

    if (isSubmitted) {
      if (optionIndex === quiz.correctAnswer) {
        return {
          ...baseStyle,
          borderColor: "#48bb78",
          background: "#f0fff4",
        };
      } else if (
        optionIndex === selectedOption &&
        optionIndex !== quiz.correctAnswer
      ) {
        return {
          ...baseStyle,
          borderColor: "#f56565",
          background: "#fff5f5",
        };
      }
    } else if (optionIndex === selectedOption) {
      return {
        ...baseStyle,
        borderColor: "#4299e1",
        background: "#ebf8ff",
      };
    }

    return baseStyle;
  };

  const getOptionLetterStyle = (optionIndex: number): React.CSSProperties => {
    const baseStyle = { ...styles.optionLetter };

    if (isSubmitted) {
      if (optionIndex === quiz.correctAnswer) {
        return { ...baseStyle, background: "#48bb78", color: "white" };
      } else if (
        optionIndex === selectedOption &&
        optionIndex !== quiz.correctAnswer
      ) {
        return { ...baseStyle, background: "#f56565", color: "white" };
      }
    } else if (optionIndex === selectedOption) {
      return { ...baseStyle, background: "#4299e1", color: "white" };
    }

    return baseStyle;
  };

  return (
    <div style={styles.quizCard}>
      <div style={styles.quizHeader}>
        <h3 style={styles.quizQuestion}>{quiz.question}</h3>
        {quiz.category && (
          <span style={styles.quizCategory}>{quiz.category}</span>
        )}
      </div>

      <div style={styles.quizOptions}>
        {quiz.options.map((option, index) => (
          <div
            key={index}
            style={getOptionStyle(index)}
            onClick={() => handleOptionSelect(index)}
          >
            <span style={getOptionLetterStyle(index)}>
              {String.fromCharCode(65 + index)}
            </span>
            <span style={styles.optionText}>{option}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {!isSubmitted ? (
          <button
            style={
              selectedOption === null
                ? styles.submitBtnDisabled
                : styles.submitBtn
            }
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit Answer
          </button>
        ) : (
          <div style={styles.resultSection}>
            <div
              style={
                selectedOption === quiz.correctAnswer
                  ? styles.resultMessageCorrect
                  : styles.resultMessageIncorrect
              }
            >
              {selectedOption === quiz.correctAnswer
                ? "✓ Correct!"
                : "✗ Incorrect!"}
            </div>
            {quiz.explanation && (
              <div style={styles.explanation}>{quiz.explanation}</div>
            )}
            <button style={styles.resetBtn} onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
