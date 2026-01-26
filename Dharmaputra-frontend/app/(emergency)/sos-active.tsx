import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/api";
import * as Location from "expo-location";

export default function SOSActive() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (seconds === 0 && !cancelled) {
      sendSOS();
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const sendSOS = async () => {
  try {
    let location = null;

    const { status } =
      await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      location = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
    }

    console.log("Sending SOS with location:", location);
    const response = await api.post("/emergency/sos", {
      location,
    });
    console.log("SOS response:", response.data);

    router.replace("/success/sos");
  } catch (error: any) {
    console.error("SOS failed - Full Error:", error);
    console.error("Response status:", error.response?.status);
    console.error("Response data:", error.response?.data);
    console.error("Request URL:", error.config?.url);
    console.error("Request headers:", error.config?.headers);
    router.replace("/(tabs)/(senior)/home");
  }
};


  const cancelSOS = () => {
    setCancelled(true);
    router.replace("/(tabs)/(senior)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 SOS ACTIVATED</Text>
      <Text style={styles.timer}>
        Sending alert in {seconds} seconds
      </Text>

      <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
        <Text style={styles.cancelText}>Cancel SOS</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B71C1C", // deep emergency red
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },

  timer: {
    fontSize: 20,
    color: "#FFEBEE",
    marginBottom: 40,
    textAlign: "center",
  },

  cancelBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    minWidth: 200,
    alignItems: "center",
    elevation: 4,
  },

  cancelText: {
    color: "#B71C1C",
    fontSize: 18,
    fontWeight: "700",
  },
});
