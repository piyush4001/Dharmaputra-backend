import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/api";

export default function LinkSenior() {
  const router = useRouter();

  const [seniorPhone, setSeniorPhone] = useState("");
  const [isPrimary, setIsPrimary] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    if (seniorPhone.length !== 10) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      await api.post("/profile/family/link-senior", {
        seniorPhone,
        isPrimaryContact: isPrimary,
      });

      // Success → go to home
      router.replace("/(tabs)");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Failed to link senior",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link to Senior</Text>

      <Text style={styles.subtitle}>
        Enter the registered mobile number of the senior
      </Text>

      <View style={styles.inputRow}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          value={seniorPhone}
          onChangeText={setSeniorPhone}
          placeholder="Senior's mobile number"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.checkbox,
          isPrimary && styles.checkboxActive,
        ]}
        onPress={() => setIsPrimary(!isPrimary)}
      >
        <Text style={styles.checkboxText}>
          {isPrimary ? "✓ " : ""}Set as primary contact
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLink}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Linking..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
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
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  prefix: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  checkbox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 24,
  },
  checkboxActive: {
    borderColor: "#2E7D32",
    backgroundColor: "#E8F5E9",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
