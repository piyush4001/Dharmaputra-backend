import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/api";

export default function AddSenior() {
  const router = useRouter();

  const [form, setForm] = useState({
    seniorPhone: "",
    relation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.seniorPhone || !form.relation) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/profile/family/link-senior", {
        seniorPhone: form.seniorPhone,
        relation: form.relation,
      });

      Alert.alert(
        "Request Sent",
        "Your request has been sent. Please wait for senior approval.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 404) {
        Alert.alert("Senior Not Found", "No senior found with this phone number");
        return;
      }

      if (status === 409) {
        Alert.alert(
          "Already Sent",
          "You have already sent a request to this senior"
        );
        return;
      }

      console.error("Link senior failed:", error);
      Alert.alert("Error", "Failed to send request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link a Senior</Text>

      <Input
        label="Senior Phone Number"
        value={form.seniorPhone}
        keyboard="number-pad"
        onChange={(v) => setForm({ ...form, seniorPhone: v })}
      />

      <Input
        label="Relation"
        value={form.relation}
        onChange={(v) => setForm({ ...form, relation: v })}
        placeholder="e.g. SON, DAUGHTER"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Request"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Input({
  label,
  value,
  onChange,
  keyboard = "default",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: any;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        keyboardType={keyboard}
        placeholder={placeholder}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1B5E20",
  },
  inputWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
