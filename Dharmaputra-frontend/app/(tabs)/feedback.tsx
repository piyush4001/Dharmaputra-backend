import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import api from "@/utils/api";

type FeedbackType = "TEXT" | "AUDIO" | "VIDEO";

const VIDEO_MAX_DURATION = 120; // ⏱ 2 minutes
const AUDIO_MAX_DURATION = 300; // ⏱ 5 minutes (seconds)

export default function FeedbackScreen() {
  const router = useRouter();

  const [type, setType] = useState<FeedbackType>("TEXT");
  const [text, setText] = useState("");
  const [media, setMedia] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🎤 audio recording
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const audioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  /* ---------------- PERMISSIONS ---------------- */
  useEffect(() => {
    ImagePicker.requestCameraPermissionsAsync();
    ImagePicker.requestMediaLibraryPermissionsAsync();
    Audio.requestPermissionsAsync();
  }, []);

  /* ---------------- VIDEO ---------------- */
  const recordVideo = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      videoMaxDuration: VIDEO_MAX_DURATION, // ✅ 2 min limit
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      if (
        result.assets[0].duration &&
        result.assets[0].duration / 1000 > VIDEO_MAX_DURATION
      ) {
        Alert.alert(
          "Video too long",
          "Please select a video shorter than 2 minutes."
        );
        return;
      }
      setMedia(result.assets[0]);
    }
  };

  /* ---------------- AUDIO ---------------- */
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setRecordingUri(null);

      // ⏱ auto-stop after 5 minutes
      audioTimerRef.current = setTimeout(() => {
        stopRecording(true);
      }, AUDIO_MAX_DURATION * 1000);
    } catch {
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async (autoStopped = false) => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    setRecording(null);
    setRecordingUri(uri || null);

    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }

    if (autoStopped) {
      Alert.alert(
        "Recording stopped",
        "Maximum audio duration (5 minutes) reached."
      );
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const submitFeedback = async () => {
    if (type === "TEXT" && !text.trim()) {
      return Alert.alert("Validation", "Please write your feedback.");
    }

    const formData = new FormData();
    formData.append("type", type);
    if (text) formData.append("text", text);

    if (type === "AUDIO" && recordingUri) {
      formData.append("media", {
        uri: recordingUri,
        name: "feedback-audio.m4a",
        type: "audio/m4a",
      } as any);
    }

    if (media) {
      formData.append("media", {
        uri: media.uri,
        name: "feedback-video.mp4",
        type: "video/mp4",
      } as any);
    }

    try {
      setSubmitting(true);
      await api.post("/feedback", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Thank you", "Your feedback has been submitted.");
      router.back();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback / Complaint</Text>

      {/* TYPE SELECT */}
      <View style={styles.typeRow}>
        {(["TEXT", "AUDIO", "VIDEO"] as FeedbackType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.typeBtn,
              type === t && styles.typeBtnActive,
            ]}
            onPress={() => {
              setType(t);
              setMedia(null);
              setRecordingUri(null);
            }}
          >
            <Text
              style={[
                styles.typeText,
                type === t && styles.typeTextActive,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TEXT */}
      <TextInput
        style={styles.input}
        placeholder="Write your feedback..."
        multiline
        value={text}
        onChangeText={setText}
      />

      {/* VIDEO */}
      {type === "VIDEO" && (
        <>
          <TouchableOpacity style={styles.mediaBtn} onPress={recordVideo}>
            <Text style={styles.mediaText}>
              🎥 Record Video (max 2 min)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaBtn} onPress={pickFromGallery}>
            <Text style={styles.mediaText}>
              🖼️ Choose from Gallery
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* AUDIO */}
      {type === "AUDIO" && (
        <TouchableOpacity
          style={styles.mediaBtn}
          onPress={recording ? () => stopRecording() : startRecording}
        >
          <Text style={styles.mediaText}>
            {recording
              ? "⏹️ Stop Recording"
              : recordingUri
              ? "🎤 Recorded ✔ (max 5 min)"
              : "🎤 Start Recording (max 5 min)"}
          </Text>
        </TouchableOpacity>
      )}

      {/* SUBMIT */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={submitFeedback}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 20,
  },
  typeRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#EEE",
    marginRight: 8,
  },
  typeBtnActive: {
    backgroundColor: "#2E7D32",
  },
  typeText: {
    fontWeight: "600",
    color: "#444",
  },
  typeTextActive: {
    color: "#FFF",
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  mediaBtn: {
    padding: 14,
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  mediaText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
