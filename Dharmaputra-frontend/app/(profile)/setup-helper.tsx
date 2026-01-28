import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/api";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

/* ---------------- CONSTANTS ---------------- */

const EDUCATION_OPTIONS = [
  { label: "No Formal Education", value: "NO_FORMAL_EDUCATION" },
  { label: "Primary", value: "PRIMARY" },
  { label: "Secondary", value: "SECONDARY" },
  { label: "Higher Secondary", value: "HIGHER_SECONDARY" },
  { label: "Graduate", value: "GRADUATE" },
  { label: "Post Graduate", value: "POST_GRADUATE" },
];

/* ---------------- COMPONENT ---------------- */

export default function SetupHelperProfile() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    education: "",
    houseNo: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- IMAGE PICKERS ---------------- */

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.age ||
      !form.education ||
      !form.area ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!image) {
      alert("Profile picture is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("firstName", form.firstName);
      data.append("lastName", form.lastName);
      data.append("age", form.age);
      data.append("education", form.education);

      data.append(
        "address",
        JSON.stringify({
          houseNo: form.houseNo,
          area: form.area,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        })
      );

      data.append("profileImage", {
        uri: image.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      await api.post("/profile/setup/helper", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // router.replace("/(tabs)/(helper)/home");
      router.replace("/(tabs)/id-upload");
    } catch (error: any) {
      console.error("Helper setup failed", error);
      alert(error?.response?.data?.message || "Failed to setup helper profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Helper Profile</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself to start helping seniors
        </Text>
      </View>

      {/* PROFILE IMAGE */}
      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#777" }}>Add Photo</Text>
          </View>
        )}

        <View style={styles.imageButtons}>
          <TouchableOpacity onPress={takePhoto} style={styles.imageBtn}>
            <Text>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
            <Text>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FORM CARD */}
      <View style={styles.formCard}>
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
          label="Age"
          value={form.age}
          keyboardType="number-pad"
          onChange={(v) => setForm({ ...form, age: v })}
        />

        {/* EDUCATION PICKER */}
        <View style={styles.inputWrap}>
          <Text style={styles.label}>Education</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.education}
              onValueChange={(value) => setForm({ ...form, education: value })}
            >
              <Picker.Item label="Select education" value="" />
              {EDUCATION_OPTIONS.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Address</Text>

        <Input
          label="House No. (Optional)"
          value={form.houseNo}
          onChange={(v) => setForm({ ...form, houseNo: v })}
        />

        <Input
          label="Area / Locality"
          value={form.area}
          onChange={(v) => setForm({ ...form, area: v })}
        />

        <Input
          label="City"
          value={form.city}
          onChange={(v) => setForm({ ...form, city: v })}
        />

        <Input
          label="State"
          value={form.state}
          onChange={(v) => setForm({ ...form, state: v })}
        />

        <Input
          label="Pincode"
          value={form.pincode}
          keyboardType="number-pad"
          onChange={(v) => setForm({ ...form, pincode: v })}
        />
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
        keyboardType={keyboardType}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor="#999"
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B5E20",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtons: {
    flexDirection: "row",
    marginTop: 12,
  },
  imageBtn: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginHorizontal: 6,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 12,
  },
  inputWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
  },
  pickerWrapper: {
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
