import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "@/utils/api";

export default function SetupSenior() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    emergencyContact: "",
    medicalInfo: "",
  });

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  /* 📷 Camera */
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission required");
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

  /* 🖼 Gallery */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Gallery permission required");
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

  const handleSubmit = async () => {
    if (!form.firstName || !form.age || !form.address) {
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
      data.append("age", String(form.age));
      data.append("address", String(form.address));
      data.append("emergencyContact", form.emergencyContact);
      data.append("medicalInfo", form.medicalInfo);

      data.append("profileImage", {
        uri: image.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      await api.post("/profile/setup/senior", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //router.replace("/permissions/location");
      router.replace("/(tabs)/id-upload");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to setup profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Senior Profile</Text>

      {/* 🖼 Profile Image */}
      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#777" }}>No Image</Text>
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
        keyboard="number-pad"
        onChange={(v) => setForm({ ...form, age: v })}
      />
      <Input
        label="Address"
        value={form.address}
        onChange={(v) => setForm({ ...form, address: v })}
      />
      <Input
        label="Emergency Contact"
        value={form.emergencyContact}
        keyboard="number-pad"
        onChange={(v) => setForm({ ...form, emergencyContact: v })}
      />
      <Input
        label="Medical Info (Optional)"
        value={form.medicalInfo}
        onChange={(v) => setForm({ ...form, medicalInfo: v })}
      />

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

function Input({
  label,
  value,
  onChange,
  keyboard = "default",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: any;
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        keyboardType={keyboard}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 20,
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
    borderRadius: 8,
    marginHorizontal: 6,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
