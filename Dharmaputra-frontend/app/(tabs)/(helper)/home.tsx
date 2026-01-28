import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Modal,
  Pressable,
  Image,
  Alert,
  Linking,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api";
import useProfile from "../../hooks/useProfile";
import { useRouter } from "expo-router";

/* ================= TYPES ================= */

type Senior = {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type Emergency = {
  _id: string;
  location?: {
    lat?: number;
    lng?: number;
  };
  senior?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
};

/* ================= COMPONENT ================= */

export default function HelperHome() {
  const router = useRouter();
  const { profile } = useProfile();

  const [greeting, setGreeting] = useState("Hello");
  const [linkedSeniors, setLinkedSeniors] = useState<Senior[]>([]);
  const [sosList, setSosList] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [activeSOS, setActiveSOS] = useState<Emergency | null>(null);

  /* ---------- GREETING ---------- */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = useCallback(async () => {
    try {
      const [seniorsRes, emergencyRes] = await Promise.all([
        api.get("/profile/helper/seniors"), // ✅ linked seniors
        api.get("/emergency/linked"),       // ✅ linked emergencies
      ]);
      console.log("HelperHome fetchData:",  emergencyRes.data?.emergencies );
      setLinkedSeniors(seniorsRes.data || []);
      setSosList(emergencyRes.data?.emergencies || []);
    } catch (error) {
      console.error("HelperHome fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- MAP NAVIGATION ---------------- */
  const openGoogleMaps = (lat?: number, lng?: number) => {
    if (!lat || !lng) {
      Alert.alert("Location unavailable");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open Google Maps")
    );
  };

  /* ---------------- SOS MODAL ---------------- */
  const openSOSModal = (sos: Emergency) => {
    setActiveSOS(sos);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveSOS(null);
  };

  /* ================= UI ================= */

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

      {/* ACTIVE EMERGENCIES */}
      <Text style={styles.sectionTitle}>Active Emergencies</Text>

      {sosList.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No active emergencies</Text>
        </View>
      ) : (
        sosList.map((sos) => (
          <TouchableOpacity
            key={sos._id}
            style={styles.sosCard}
            onPress={() => openSOSModal(sos)}
          >
            <Text style={styles.sosName}>
              {sos.senior?.firstName || "Senior"}{" "}
              {sos.senior?.lastName || ""}
            </Text>

            <Text style={styles.sosSub}>
              📞 {sos.senior?.phone || "N/A"}
            </Text>

            <Text style={styles.tapHint}>Tap to navigate</Text>
          </TouchableOpacity>
        ))
      )}

      {/* LINKED SENIORS */}
      <Text style={styles.sectionTitle}>Linked Seniors</Text>

      {loading ? (
        <Text style={styles.infoText}>Loading seniors...</Text>
      ) : linkedSeniors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No seniors linked yet</Text>
        </View>
      ) : (
        <FlatList
          data={linkedSeniors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.seniorCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(item.firstName || "S")[0]}
                </Text>
              </View>

              <View>
                <Text style={styles.seniorName}>
                  {item.firstName || "Senior"} {item.lastName || ""}
                </Text>
                {item.phone && (
                  <Text style={styles.seniorPhone}>📞 {item.phone}</Text>
                )}
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/addSenior")}
      >
        <Text style={styles.buttonText}>+ Link a Senior</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={closeModal} />

        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Emergency Alert</Text>

          {activeSOS && (
            <>
              <Text style={styles.modalName}>
                {activeSOS.senior?.firstName || "Senior"}{" "}
                {activeSOS.senior?.lastName || ""}
              </Text>

              <Text style={styles.modalSub}>
                📞 {activeSOS.senior?.phone || "N/A"}
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => {
              openGoogleMaps(
                activeSOS?.location?.lat,
                activeSOS?.location?.lng
              );
              closeModal();
            }}
          >
            <Text style={styles.acceptText}>Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectBtn} onPress={closeModal}>
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
    marginBottom: 8,
  },

  leftHeader: {
    flexShrink: 1,
  },

  rightHeader: {
    alignItems: "center",
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
    marginTop: 2,
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 4,
  },

  activeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  activeText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
    marginRight: 6,
  },

  status: {
    fontSize: 13,
    color: "#555",
    marginBottom: 20,
  },

  emergencyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8B1E1E",
    marginBottom: 12,
  },

  emergencyBlock: {
    marginBottom: 24,
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
    marginTop: 2,
  },
  sectionTitle: {
  fontSize: 19,
  fontWeight: "800",
  color: "#1B5E20",
  marginTop: 16,
  marginBottom: 12,
},


  tapHint: {
    fontSize: 12,
    color: "#8B1E1E",
    marginTop: 6,
    fontWeight: "600",
  },
  seniorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
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
  emptyCard: {
    backgroundColor: "#F7F7F7",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
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
  acceptBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  acceptText: {
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
  infoText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 16,
  },
});
