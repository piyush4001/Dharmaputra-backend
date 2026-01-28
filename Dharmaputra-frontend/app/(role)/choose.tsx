import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { setToken } from "@/utils/storage";

type Role = "SENIOR" | "FAMILY" | "HELPER";

export default function ChooseRole() {
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const selectRole = async (role: Role) => {
    try {
      const res = await api.post("/profile/set-role", { role });

      if (res.data.token) {
        await setToken(res.data.token);
      }

      await refreshAuth();

      if (role === "SENIOR") {
        router.replace("/(profile)/setup-senior");
      } else if (role === "FAMILY") {
        router.replace("/(profile)/setup-family");
      } else if (role === "HELPER") {
        //router.replace("/(tabs)/(helper)/home");
        router.replace("/(profile)/setup-helper");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Failed to set role", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How will you use</Text>
        <Text style={styles.brand}>Dharmaputra</Text>
        <Text style={styles.subtitle}>
          Choose the role that best represents you
        </Text>
      </View>

      {/* Role Cards */}
      <TouchableOpacity
        style={[styles.card, styles.senior]}
        activeOpacity={0.9}
        onPress={() => selectRole("SENIOR")}
      >
        <Text style={styles.cardTitle}>Senior Citizen</Text>
        <Text style={styles.cardDesc}>
          Receive timely help and stay protected
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.family]}
        activeOpacity={0.9}
        onPress={() => selectRole("FAMILY")}
      >
        <Text style={styles.cardTitle}>Family Member</Text>
        <Text style={styles.cardDesc}>
          Stay connected and monitor loved ones
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.helper]}
        activeOpacity={0.9}
        onPress={() => selectRole("HELPER")}
      >
        <Text style={styles.cardTitle}>Nearby Helper</Text>
        <Text style={styles.cardDesc}>Assist seniors during emergencies</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 56,
  },

  header: {
    marginBottom: 36,
  },

  title: {
    fontSize: 18,
    color: "#555",
  },

  brand: {
    fontSize: 26,
    fontWeight: "800",
    color: "#8B1E1E", // maroon from logo
    marginTop: 2,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  senior: {
    borderLeftWidth: 6,
    borderLeftColor: "#F4C430", // yellow/gold
  },

  family: {
    borderLeftWidth: 6,
    borderLeftColor: "#2E7D32", // green
  },

  helper: {
    borderLeftWidth: 6,
    borderLeftColor: "#8B1E1E", // maroon
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
