import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { registerPushToken } from "@/utils/registerPushToken";
import api from "@/utils/api";
import useProfile from "../../hooks/useProfile";

type Senior = {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
};

type Emergency = {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  triggeredAt: string;
  senior: {
    firstName: string;
    lastName: string;
    phone: string;
  };
};

/* ================= COMPONENT ================= */

export default function FamilyHome() {
  const router = useRouter();
  const { profile } = useProfile();

  const [greeting, setGreeting] = useState("Hello");
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [sosList, setSosList] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [activeSOS, setActiveSOS] = useState<Emergency | null>(null);
  const [responding, setResponding] = useState(false);

  /* ---------------- GREETING ---------------- */
  useEffect(() => {
    registerPushToken();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = useCallback(async () => {
    try {
      const [seniorsRes, sosRes] = await Promise.all([
        api.get("/profile/family/seniors"),
        api.get("/emergency/linked"),
      ]);

      setSeniors(seniorsRes.data || []);
      setSosList(sosRes.data.emergencies || []);
    } catch (error) {
      console.error("Failed to load family home data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- MAP NAVIGATION ---------------- */
  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open Google Maps")
    );
  };

  /* ---------------- UNLINK ---------------- */
  const handleUnlinkSenior = (seniorId: string) => {
    Alert.alert(
      "Unlink Senior",
      "Are you sure you want to unlink this senior?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post("/profile/unlink", {
                targetUserId: seniorId,
              });
              Alert.alert("Success", "Senior unlinked successfully");
              setTimeout(fetchData, 500);
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to unlink senior"
              );
            }
          },
        },
      ]
    );
  };

  /* ---------------- SOS ---------------- */
  const openSOSModal = (sos: Emergency) => {
    setActiveSOS(sos);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveSOS(null);
  };

  const handleRespond = async () => {
    if (!activeSOS || responding) return;

    try {
      setResponding(true);
      openGoogleMaps(
        activeSOS.location.lat,
        activeSOS.location.lng
      );
      closeModal();
    } finally {
      setResponding(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          {profile?.firstName && (
            <Text style={styles.nameText}>
              {profile.firstName} {profile.lastName || ""}
            </Text>
          )}
        </View>

        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* ACTIVE EMERGENCY */}
      {sosList.length === 0 ? (
        <Text style={styles.emergencyTitle}>No Active Emergency</Text>
      ) : (
        <View style={styles.emergencyBlock}>
          <Text style={styles.emergencyTitle}>Active Emergency</Text>

          {sosList.map((sos) => (
            <TouchableOpacity
              key={sos._id}
              style={styles.sosCard}
              onPress={() => openSOSModal(sos)}
            >
              <Text style={styles.sosName}>
                From: {sos.senior.firstName} {sos.senior.lastName}
              </Text>

              <Text style={styles.sosSub}>
                📞 {sos.senior.phone}
              </Text>

              <Text style={styles.tapHint}>Tap to navigate</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* LINKED SENIORS */}
      <Text style={styles.sectionTitle}>Linked Seniors</Text>

      {loading ? (
        <Text style={styles.infoText}>Loading seniors...</Text>
      ) : seniors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No seniors linked yet</Text>
        </View>
      ) : (
        <FlatList
          data={seniors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.seniorCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(item.firstName || "S")[0]}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.seniorName}>
                  {item.firstName || "Senior"} {item.lastName || ""}
                </Text>
                <Text style={styles.seniorPhone}>📞 {item.phone}</Text>

                <TouchableOpacity
                  onPress={() => handleUnlinkSenior(item._id)}
                  style={{ marginTop: 6 }}
                >
                  <Text style={styles.unlinkText}>Unlink</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {seniors.length < 5 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-senior")}
        >
          <Text style={styles.buttonText}>+ Link a Senior</Text>
        </TouchableOpacity>
      )}

      {/* SOS MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={closeModal} />

        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Emergency Alert</Text>

          {activeSOS && (
            <>
              <Text style={styles.modalName}>
                {activeSOS.senior.firstName} {activeSOS.senior.lastName}
              </Text>
              <Text style={styles.modalSub}>
                📞 {activeSOS.senior.phone}
              </Text>
            </>
          )}

          <TouchableOpacity
            style={[styles.respondBtn, responding && { opacity: 0.6 }]}
            onPress={handleRespond}
            disabled={responding}
          >
            <Text style={styles.respondText}>
              {responding ? "Opening Maps..." : "Navigate"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={closeModal}
          >
            <Text style={styles.rejectText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  logo: {
    width: 42,
    height: 42,
  },
  emergencyBlock: {
    marginBottom: 24,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8B1E1E",
    marginBottom: 12,
  },
  sosCard: {
    backgroundColor: "#FFF5F5",
    borderLeftWidth: 6,
    borderLeftColor: "#B71C1C",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  sosName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B71C1C",
  },
  sosSub: {
    fontSize: 14,
    color: "#444",
  },
  tapHint: {
    fontSize: 12,
    color: "#8B1E1E",
    marginTop: 6,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  seniorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginBottom: 12,
    elevation: 3,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  seniorName: {
    fontSize: 16,
    fontWeight: "600",
  },
  seniorPhone: {
    fontSize: 14,
    color: "#555",
  },
  unlinkText: {
    color: "#B71C1C",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: "#F7F7F7",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
  },
  infoText: {
    fontSize: 14,
    color: "#777",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8B1E1E",
    marginBottom: 12,
  },
  modalName: {
    fontSize: 16,
    fontWeight: "700",
  },
  modalSub: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  respondBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  respondText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  rejectBtn: {
    backgroundColor: "#FDECEA",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  rejectText: {
    color: "#B71C1C",
    fontSize: 15,
    fontWeight: "600",
  },
});
