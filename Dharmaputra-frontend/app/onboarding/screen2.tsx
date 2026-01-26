import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function Screen2({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/onboarding/family.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Your Family, Always Connected</Text>

      <Text style={styles.subtitle}>
        Your loved ones receive instant alerts and live location, no matter
        where they are.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <Text style={styles.skip}>Skip</Text>
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
