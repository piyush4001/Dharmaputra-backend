import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/api";
import { getToken } from "@/utils/storage";
import { isTokenExpired, getRoleFromToken } from "@/utils/jwt";
import { removeToken } from "@/utils/storage";
export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * ✅ STEP 2: Auto-login on app restart
   * - If token exists, skip start/login
   * - Go directly to tabs
   * - No role logic yet
   */
  // useEffect(() => {
  //   const checkAutoLogin = async () => {
  //     const token = await getToken();
  //     if (token) {
  //       router.replace("/(tabs)");
  //     }
  //   };

  //   checkAutoLogin();
  // }, []);


useEffect(() => {
  const checkAutoLogin = async () => {
    const token = await getToken();
    if (!token) return;

    // 🔐 Token expired → force logout
    if (isTokenExpired(token)) {
      await removeToken();
      return;
    }

    const role = getRoleFromToken(token);

    if (role === "FAMILY") {
      router.replace("/(tabs)/(family)/home");
    } else if (role === "SENIOR") {
      router.replace("/(tabs)/(senior)/home");
    } else if( role === "HELPER") {
      router.replace("/(tabs)/(helper)/home");
    } else {
      router.replace("/(role)/choose");
    }
  };

  checkAutoLogin();
}, []);


  const handleContinue = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/send-otp", { phone });

      router.push({
        pathname: "/auth/otp",
        params: { phone },
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Logo + Branding */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Dharmaputra</Text>
        <Text style={styles.tagline}>Help when it matters the most</Text>
      </View>

      {/* Login Card */}
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Enter your mobile number to continue
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="Mobile number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setPhone(numericText);
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending OTP..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 72,
    height: 72,
    marginBottom: 12,
  },

  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
  },

  tagline: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
  },

  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
    color: "#111",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },

  button: {
    height: 52,
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
