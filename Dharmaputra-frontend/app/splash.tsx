import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  // 1️⃣ Always show splash
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // 2️⃣ Decide route AFTER splash
  useEffect(() => {
    if (!splashDone) return;

    const decideRoute = async () => {
      const hasOpenedApp = await AsyncStorage.getItem("hasOpenedApp");

      // First time → onboarding
      if (!hasOpenedApp) {
        await AsyncStorage.setItem("hasOpenedApp", "true");
        router.replace("/onboarding");
        return;
      }

      // Not first time → start
      router.replace("/auth/start");
    };

    decideRoute();
  }, [splashDone]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.projectRow}>
        <Image
          source={require("../assets/lions.png")}
          style={styles.lionsLogo}
          resizeMode="contain"
        />
        <Text style={styles.projectText}>Project by Lions Clubs</Text>
      </View>

      <Text style={styles.appName}>धर्मपुत्र</Text>

      <Text style={styles.tagline}>
        Your family’s safety, always connected.
      </Text>

      <ActivityIndicator
        size="small"
        color="#2E7D32"
        style={{ marginTop: 28 }}
      />
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
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 160,
    height: 160,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  lionsLogo: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  projectText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  appName: {
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
  },
});
