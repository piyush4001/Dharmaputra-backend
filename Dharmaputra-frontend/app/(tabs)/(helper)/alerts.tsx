import { View, Text, StyleSheet } from "react-native";

export default function HelperAlerts() {
  return (
    <View style={styles.container}>
      <Text>No alerts right now</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
