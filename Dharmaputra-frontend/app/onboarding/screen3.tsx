import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Screen3() {
  const router = useRouter();

  const handleGetStarted = async () => {
    // mark onboarding as completed
    await AsyncStorage.setItem("hasSeenOnboarding", "true");

    // go to login screen
    router.replace("/auth/start");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/onboarding/emergency.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Instant Emergency Help</Text>

      <Text style={styles.subtitle}>
        One tap connects you to your family and nearby helpers in seconds.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  image: {
    width: "100%",
    height: 260,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
  },
  button: {
    width: "70%",
    height: 48,
    backgroundColor: "#4DA3FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  skip: {
    marginTop: 18,
    fontSize: 13,
    color: "#999",
  },
});
