import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role as string;
  const email = params.email as string;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Initialize refs array
  if (inputRefs.current.length !== otp.length) {
    inputRefs.current = Array(otp.length).fill(null);
  }

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = (enteredOtp: string) => {
    // Mock verification - in real app, you'd call your backend
    if (enteredOtp === "123456") {
      // Mock valid OTP
      // Navigate to role-specific first step
      if (role === "student") {
        router.push("/(auth)/register/student/personal-info");
      } else {
        router.push("/(auth)/register/tutor/personal-info");
      }
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct verification code.");
    }
  };

  const resendOtp = () => {
    setTimer(60);
    // Mock resend OTP
    Alert.alert(
      "OTP Sent",
      "A new verification code has been sent to your email."
    );
  };

  // Start timer countdown
  useState(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Step 2 of 4</Text>
          <Text style={styles.stepSubtitle}>Verify Your Email</Text>
        </View>

        <View style={styles.messageContainer}>
          <Ionicons name="mail" size={60} color="#fff" />
          <Text style={styles.messageTitle}>Check your email</Text>
          <Text style={styles.messageText}>
            We've sent a 6-digit verification code to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => verifyOtp(otp.join(""))}
        >
          <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={resendOtp}>
                <Text style={styles.resendLink}>Resend now</Text>
              </TouchableOpacity>
            )}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 5,
  },
  stepSubtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: {
    fontWeight: "bold",
    color: "#fff",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  verifyButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 18,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  timerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resendLink: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
