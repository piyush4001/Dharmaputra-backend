// import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import { useRouter } from "expo-router";
// import useProfile from "../../hooks/useProfile";
// import { logout } from "../../../utils/logout";
// import { Image } from "react-native";

// export default function SeniorProfile() {
//   const router = useRouter();
//   const { profile, loading } = useProfile();

//   const handleLogout = () => {
//     Alert.alert(
//       "Log out",
//       "Are you sure you want to log out?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Log out",
//           style: "destructive",
//           onPress: async () => {
//             await logout();
//             router.replace("/auth/start"); // ✅ SAME AS FAMILY
//           },
//         },
//       ]
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   // const initials = `${profile?.firstName?.[0] || ""}${
//   //   profile?.lastName?.[0] || ""
//   // }`.toUpperCase();

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         {/* <View style={styles.avatar}>
//           <Text style={styles.avatarText}>{initials || "S"}</Text>
//         </View> */}
//         {profile?.profileImage && (
//           <Image
//             source={{ uri: profile.profileImage }}
//             style={{
//               width: 120,
//               height: 120,
//               borderRadius: 60,
//               alignSelf: "center",
//               marginBottom: 20,
//             }}
//           />
//         )}

//         <Text style={styles.name}>
//           {profile?.firstName} {profile?.lastName}
//         </Text>

//         <Text style={styles.roleText}>Senior Citizen</Text>
//       </View>

//       {/* INFO CARD */}
//       <View style={styles.infoCard}>
//         <ProfileRow
//           label="Age"
//           value={profile?.age ? String(profile.age) : "—"}
//         />

//         <ProfileRow label="Address" value={profile?.address || "—"} />
//       </View>

//       {/* EDIT PROFILE */}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("/(profile)/edit-senior")}
//         activeOpacity={0.9}
//       >
//         <Text style={styles.buttonText}>Edit Profile</Text>
//       </TouchableOpacity>

//       {/* LOGOUT */}
//       <TouchableOpacity
//         style={styles.logoutButton}
//         onPress={handleLogout}
//       >
//         <Text style={styles.logoutText}>Log Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* 🔹 Reusable row */
// function ProfileRow({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <View style={styles.row}>
//       <Text style={styles.rowLabel}>{label}</Text>
//       <Text style={styles.rowValue}>{value}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 24,
//     paddingTop: 48,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   loadingText: {
//     fontSize: 14,
//     color: "#666",
//   },

//   /* Header */
//   header: {
//     alignItems: "center",
//     marginBottom: 32,
//   },

//   avatar: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     backgroundColor: "#2E7D32",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },

//   avatarText: {
//     color: "#FFFFFF",
//     fontSize: 28,
//     fontWeight: "800",
//   },

//   name: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111",
//     marginBottom: 4,
//   },

//   roleText: {
//     fontSize: 13,
//     color: "#8B1E1E",
//     fontWeight: "600",
//   },

//   /* Info Card */
//   infoCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 3,
//     marginBottom: 24,
//   },

//   row: {
//     marginBottom: 16,
//   },

//   rowLabel: {
//     fontSize: 12,
//     color: "#777",
//     marginBottom: 4,
//   },

//   rowValue: {
//     fontSize: 15,
//     color: "#111",
//     fontWeight: "500",
//   },

//   /* Buttons */
//   button: {
//     backgroundColor: "#2E7D32",
//     paddingVertical: 16,
//     borderRadius: 18,
//     alignItems: "center",
//     marginBottom: 14,
//   },

//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   logoutButton: {
//     paddingVertical: 14,
//     borderRadius: 18,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//   },

//   logoutText: {
//     color: "#B71C1C",
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import useProfile from "../../hooks/useProfile";
import { logout } from "../../../utils/logout";
import { Image } from "react-native";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppMenu from "../components/AppMenu"; // adjust path if needed
import { Linking } from "react-native";

export default function SeniorProfile() {
  const router = useRouter();
  const { profile, loading } = useProfile();

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

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
        )}

        <Text style={styles.name}>
          {profile?.firstName} {profile?.lastName}
        </Text>

        <Text style={styles.roleText}>Senior Citizen</Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <ProfileRow
          label="Age"
          value={profile?.age ? String(profile.age) : "—"}
        />
        <ProfileRow label="Address" value={profile?.address || "—"} />
      </View>

      {/* EDIT PROFILE */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(profile)/edit-senior")}
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

/* 🔹 Reusable row */
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

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
