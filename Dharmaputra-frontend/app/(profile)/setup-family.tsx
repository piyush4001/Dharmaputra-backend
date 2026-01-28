import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "@/utils/api";

export default function SetupFamilyProfile() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  const [image, setImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  /* 📷 Camera */
  const takePhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
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

  /* 🖼 Gallery */
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName) {
      alert("Please fill required fields");
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
      data.append("address", form.address);

      data.append(
        "profileImage",
        {
          uri: image.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any
      );

      await api.post("/profile/setup/family", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.replace("/(tabs)/id-upload");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        router.replace("/(tabs)");
        return;
      }

      console.error("Family setup failed", error);
      alert("Failed to setup family profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Family Profile</Text>
        <Text style={styles.subtitle}>
          Help us know you better so you can support your loved ones
        </Text>
      </View>

      {/* Profile Image */}
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

      {/* Form Card */}
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
          label="Address (Optional)"
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
          multiline
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
    </View>
  );
}

function Input({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholder={label}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8B1E1E",
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
  inputWrap: {
    marginBottom: 18,
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
  multiline: {
    height: 90,
    textAlignVertical: "top",
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
