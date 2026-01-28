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

/* ---------------- CONSTANTS ---------------- */

const AVAILABILITY_OPTIONS = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "On Call", value: "ON_CALL" },
];

const EDUCATION_OPTIONS = [
  { label: "No Formal Education", value: "NO_FORMAL_EDUCATION" },
  { label: "Primary", value: "PRIMARY" },
  { label: "Secondary", value: "SECONDARY" },
  { label: "Higher Secondary", value: "HIGHER_SECONDARY" },
  { label: "Graduate", value: "GRADUATE" },
  { label: "Post Graduate", value: "POST_GRADUATE" },
];

/* ---------------- SCREEN ---------------- */

export default function EditHelperProfile() {
  const router = useRouter();
  const { profile, loading, refetch } = useProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    availability: "FULL_TIME",
    education: "NO_FORMAL_EDUCATION",
    address: {
      houseNo: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        availability: profile.availability || "FULL_TIME",
        education: profile.education || "NO_FORMAL_EDUCATION",
        address: {
          houseNo: profile.address?.houseNo || "",
          area: profile.address?.area || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          pincode: profile.address?.pincode || "",
        },
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
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert("Required", "First name and last name are required");
      return;
    }

    if (
      !form.address.area ||
      !form.address.city ||
      !form.address.state ||
      !form.address.pincode
    ) {
      Alert.alert("Required", "Please complete your address");
      return;
    }

    try {
      await api.put("/profile/helper", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        availability: form.availability,
        education: form.education,
        address: {
          houseNo: form.address.houseNo || undefined,
          area: form.address.area,
          city: form.address.city,
          state: form.address.state,
          pincode: form.address.pincode,
        },
      });

      await refetch();
      router.back();
    } catch (error) {
      console.error("Helper profile update failed", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>
          Keep your details updated for better coordination
        </Text>

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

          <Picker
            label="Availability"
            value={form.availability}
            options={AVAILABILITY_OPTIONS}
            onChange={(v) => setForm({ ...form, availability: v })}
          />

          <Picker
            label="Education"
            value={form.education}
            options={EDUCATION_OPTIONS}
            onChange={(v) => setForm({ ...form, education: v })}
          />

          <Input
            label="House No"
            value={form.address.houseNo}
            onChange={(v) =>
              setForm({ ...form, address: { ...form.address, houseNo: v } })
            }
          />

          <Input
            label="Area"
            value={form.address.area}
            onChange={(v) =>
              setForm({ ...form, address: { ...form.address, area: v } })
            }
          />

          <Input
            label="City"
            value={form.address.city}
            onChange={(v) =>
              setForm({ ...form, address: { ...form.address, city: v } })
            }
          />

          <Input
            label="State"
            value={form.address.state}
            onChange={(v) =>
              setForm({ ...form, address: { ...form.address, state: v } })
            }
          />

          <Input
            label="Pincode"
            value={form.address.pincode}
            keyboardType="number-pad"
            onChange={(v) =>
              setForm({ ...form, address: { ...form.address, pincode: v } })
            }
          />
        </View>

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

/* ---------------- INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );
}

/* ---------------- PICKER ---------------- */

function Picker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.option,
            value === opt.value && styles.optionActive,
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={[
              styles.optionText,
              value === opt.value && styles.optionTextActive,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

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

  loadingText: { fontSize: 14, color: "#666" },

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

  inputWrap: { marginBottom: 16 },

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

  option: {
    backgroundColor: "#F5F7F9",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
  },

  optionActive: {
    backgroundColor: "#2E7D32",
  },

  optionText: {
    fontSize: 14,
    color: "#333",
  },

  optionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
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
