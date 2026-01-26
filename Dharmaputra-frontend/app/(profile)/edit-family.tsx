import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import useProfile from "../hooks/useProfile";
import api from "@/utils/api";

/**
 * Edit Family Profile Screen
 */
export default function EditFamilyProfile() {
  const router = useRouter();
  const { profile, loading, refetch } = useProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    relation: "",
    isPrimaryContact: false,
  });

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "", // ✅ FIXED
        phone: profile.phone || "",
        address: profile.address || "",
        relation: profile.relation || "",
        isPrimaryContact: profile.isPrimaryContact || false,
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

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    // ✅ Frontend validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert("Required", "First name and last name are required");
      return;
    }

    try {
      await api.put("/profile/family", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        relation: form.relation || null,
        isPrimaryContact: form.isPrimaryContact,
      });

      await refetch();
      router.back();
    } catch (error) {
      console.error("Family profile update failed", error);
      Alert.alert("Error", "Failed to update profile");
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
          Keep your details updated for better coordination
        </Text>

        {/* Form Card */}
        <View style={styles.card}>
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })}
          />

          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })}
          />

          <Input
            label="Phone Number"
            value={form.phone}
            keyboardType="phone-pad"
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <Input
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            multiline
          />

          <Input
            label="Relation (SON, DAUGHTER, WIFE, etc.)"
            value={form.relation}
            onChange={(v) =>
              setForm({ ...form, relation: v.toUpperCase() })
            }
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

/* ---------------- INPUT COMPONENT ---------------- */
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
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
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
