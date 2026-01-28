import { View, Text, StyleSheet, Image } from "react-native";

export default function SosSuccess() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Success Card */}
      <View style={styles.card}>
        <Text style={styles.check}>✅</Text>

        <Text style={styles.title}>SOS Sent Successfully</Text>
        <Text style={styles.subtitle}>
          Help is on the way. Stay calm.
        </Text>

        <View style={styles.list}>
          <Text style={styles.item}>
            • Family members notified
          </Text>
          <Text style={styles.item}>
            • Nearby helpers alerted
          </Text>
          <Text style={styles.item}>
            • Live location shared
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 48,
    height: 48,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#F8FBF9",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  check: {
    fontSize: 64,
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },

  list: {
    width: "100%",
  },

  item: {
    fontSize: 15,
    color: "#2E7D32",
    marginBottom: 10,
    textAlign: "left",
  },
});