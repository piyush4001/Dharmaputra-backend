import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import useProfile from "../hooks/useProfile";
import api from "@/utils/api";

export default function EditSeniorProfile() {
  const router = useRouter();
  const { profile, loading, refetch } = useProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    emergencyContact: "",
    medicalInfo: "",
  });

  // Prefill form
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        age: profile.age?.toString() || "",
        address: profile.address || "",
        emergencyContact: profile.emergencyContact || "",
        medicalInfo: profile.medicalInfo || "",
      });
    }
  }, [profile]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  const handleUpdate = async () => {
    try {
      await api.put("/profile/senior", {
        firstName: form.firstName,
        lastName: form.lastName,
        age: Number(form.age),
        address: form.address,
        emergencyContact: form.emergencyContact,
        medicalInfo: form.medicalInfo,
      });

      await refetch();
      router.back();
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>
          Keep your information accurate for emergencies
        </Text>

        {/* Form Card */}
        <View style={styles.card}>
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })}
          />

          <Input
            label="lastName"
            value={form.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })}
          />

          <Input
            label="Age"
            value={form.age}
            keyboardType="number-pad"
            onChange={(v) => setForm({ ...form, age: v })}
          />

          <Input
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            multiline
          />

          <Input
            label="Emergency Contact"
            value={form.emergencyContact}
            keyboardType="phone-pad"
            onChange={(v) =>
              setForm({ ...form, emergencyContact: v })
            }
          />

          <Input
            label="Medical Information"
            value={form.medicalInfo}
            onChange={(v) =>
              setForm({ ...form, medicalInfo: v })
            }
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Input Component */
function Input({
  label,
  value,
  onChange,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  keyboardType?: any;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    fontSize: 14,
    color: "#666",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20,
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 28,
  },

  inputWrap: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F5F7F9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },

  multilineInput: {
    height: 90,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});