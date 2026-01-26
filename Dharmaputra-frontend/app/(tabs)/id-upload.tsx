import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "@/utils/api";

export default function UploadIdScreen() {
  const router = useRouter();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  /* ---------------- CHECK IF ALREADY UPLOADED ---------------- */

  useEffect(() => {
    const checkIdStatus = async () => {
      try {
        const res = await api.get("/profile/me");

        if (res?.data?.profile?.idCardImage) {
          // ✅ ID already uploaded → skip
          router.replace("/permissions/location");
          return;
        }
      } catch (error) {
        console.error("ID check failed", error);
      } finally {
        setChecking(false);
      }
    };

    checkIdStatus();
  }, []);

  /* ---------------- IMAGE PICKERS ---------------- */

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleUpload = async () => {
    if (!image) {
      alert("Please upload your ID card");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("idCard", {
        uri: image.uri,
        name: "id-card.jpg",
        type: "image/jpeg",
      } as any);

      await api.post("/profile/upload-id", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.replace("/permissions/location");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to upload ID card");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload ID Card</Text>
      <Text style={styles.subtitle}>
        This is required to verify your identity
      </Text>

      {/* IMAGE PREVIEW */}
      <View style={styles.preview}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#777" }}>No ID selected</Text>
          </View>
        )}
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={takePhoto}>
          <Text>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={pickFromGallery}>
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleUpload}
      >
        <Text style={styles.primaryText}>
          {loading ? "Uploading..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingTop: 64,
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
    marginBottom: 32,
  },
  preview: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  placeholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  secondaryBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
