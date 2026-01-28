import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

import useProfile from "../../hooks/useProfile";
import { logout } from "../../../utils/logout";
import AppMenu from "../components/AppMenu";

export default function FamilyProfile() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const USER_MANUAL_URL =
    "https://www.sgsits.ac.in/files/Scholarship/PMYASHI_Notice_31_Jul_2024.pdf";

  const handleMenuSelect = async (key: string) => {
    setMenuOpen(false);

    if (key === "manual") {
      const supported = await Linking.canOpenURL(USER_MANUAL_URL);
      if (!supported) {
        Alert.alert("Error", "Unable to open user manual");
        return;
      }
      await Linking.openURL(USER_MANUAL_URL);
      return;
    }

    if (key === "about") {
      router.push("/info/about");
      return;
    }

    if (key === "contact") {
      router.push("/info/contact");
      return;
    }

    if (key === "delete") {
      console.log("Delete later");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/start");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* MENU */}
      <TouchableOpacity onPress={() => setMenuOpen(true)}>
        <Ionicons name="menu" size={26} />
      </TouchableOpacity>

      <AppMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={handleMenuSelect}
      />

      {/* HEADER */}
      <View style={styles.header}>
        {profile?.profileImage && (
          <Image
            source={{ uri: profile.profileImage }}
            style={styles.profileImage}
          />
        )}

        <Text style={styles.name}>
          {profile?.firstName} {profile?.lastName}
        </Text>

        <Text style={styles.roleText}>Family Member</Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <ProfileRow label="Name" value={profile?.firstName || "—"} />
        <ProfileRow label="Phone Number" value={profile?.phone || "—"} />
        <ProfileRow label="Address" value={profile?.address || "—"} />
      </View>

      {/* EDIT PROFILE */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(profile)/edit-family" as any)}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- REUSABLE ROW ---------------- */

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 48,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    fontSize: 14,
    color: "#666",
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },

  roleText: {
    fontSize: 13,
    color: "#8B1E1E",
    fontWeight: "600",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },

  row: {
    marginBottom: 16,
  },

  rowLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },

  rowValue: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutButton: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  logoutText: {
    color: "#B71C1C",
    fontSize: 15,
    fontWeight: "600",
  },
});
