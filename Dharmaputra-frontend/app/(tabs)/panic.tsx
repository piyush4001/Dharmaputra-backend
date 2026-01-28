import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { useRef, useState } from "react";
import api from "@/utils/api";
import { router } from "expo-router";

export default function PanicScreen() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [triggered, setTriggered] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    if (triggered) return;

    setCountdown(3);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev === 1) {
          clearInterval(timerRef.current!);
          triggerEmergency();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const cancelHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(null);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Web-specific: Track if we're currently holding to prevent double calls
  const isHoldingRef = useRef(false);

  const handlePressIn = () => {
    if (!isHoldingRef.current && !triggered) {
      isHoldingRef.current = true;
      startHold();
    }
  };

  const handlePressOut = () => {
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      cancelHold();
    }
  };

  // const triggerEmergency = async () => {
  //   try {
  //     setTriggered(true);

  //     await api.post("/emergency/trigger", {
  //       location: null, // later: GPS
  //     });
  //   } catch (error: any) {
  //     console.log("AXIOS ERROR:", {
  //       message: error.message,
  //       status: error.response?.status,
  //       data: error.response?.data,
  //     });

  //     alert(error.response?.data?.message || "Failed to trigger emergency");

  //     setTriggered(false);
  //   }
  // };
  const triggerEmergency = async () => {
    try {
      setTriggered(true);

      await api.post("/emergency/trigger", {
        location: null, // later: GPS
      });

      // ✅ NEW: go to active emergency page
      router.replace("/(emergency)/sos-active");
    } catch (error: any) {
      console.log("AXIOS ERROR:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      alert(error.response?.data?.message || "Failed to trigger emergency");

      setTriggered(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency</Text>
      <Text style={styles.subtitle}>
        Press and hold the button below to call for help
      </Text>

      <Animated.View
        style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onTouchCancel={Platform.OS === "web" ? handlePressOut : undefined}
          style={[styles.panicButton, triggered && styles.disabled]}
        >
          <Text style={styles.panicText}>
            {triggered ? "HELP IS ON THE WAY" : countdown ? countdown : "HOLD"}
          </Text>
        </Pressable>
      </Animated.View>

      <Text style={styles.hint}>Release before countdown ends to cancel</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#B71C1C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonWrapper: {
    marginBottom: 24,
  },
  panicButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#D32F2F",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  disabled: {
    backgroundColor: "#9E9E9E",
  },
  panicText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
  },
  hint: {
    fontSize: 12,
    color: "#777",
  },
});
