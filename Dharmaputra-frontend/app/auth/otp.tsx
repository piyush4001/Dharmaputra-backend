import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "@/utils/api";
import { setToken } from "@/utils/storage";
import { getRoleFromToken } from "@/utils/jwt";
export default function OtpScreen() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // phone passed from login screen
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      alert("Please enter valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Call backend OTP verification
      const response = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      const { token , role } = response.data;

      // 🔐 Store JWT (web + mobile safe)
      console.log("Storing token:", response.data);
      await setToken(token);

      // 🚦 Navigate based on role
      if (role==null) {
        router.replace("/(role)/choose");
        return;
       } 
       if (role === "FAMILY") {
        router.replace("/(tabs)/(family)/home");
      } else if (role === "SENIOR") {
        router.replace("/(tabs)/(senior)/home");
      } else if (role === "HELPER") {
        router.replace("/(tabs)/(helper)/home"); // first-time user
      }
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Invalid or expired OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 4-digit code sent to your mobile
      </Text>

      <TextInput
        style={styles.otpInput}
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
        placeholder="----"
        textAlign="center"
      />

      <TouchableOpacity
        style={styles.verifyBtn}
        onPress={verifyOtp}
        disabled={loading}
      >
        <Text style={styles.verifyText}>
          {loading ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    fontSize: 24,
    letterSpacing: 16,
    paddingVertical: 14,
    marginBottom: 24,
    backgroundColor: "#FFF",
  },
  verifyBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  verifyText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
