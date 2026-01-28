import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

export default function LocationPermission() {
  const router = useRouter();

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert(
        "Location access is required to continue. Please allow location permission."
      );
      return;
    }

    // Permission granted → go to app
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.description}>
        Dharmaputra uses your location to:
        {"\n"}• Share live location during SOS
        {"\n"}• Find nearby helpers
        {"\n"}• Ensure faster assistance
      </Text>

      <TouchableOpacity style={styles.button} onPress={requestPermission}>
        <Text style={styles.buttonText}>Allow Location Access</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#555",
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
