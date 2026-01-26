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
} from "react-native";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import useProfile from "../../hooks/useProfile";
import { useRouter } from "expo-router";

type Senior = {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type Emergency = {
  _id: string;
  user?: {
    phone: string;
  };
  seniorProfile?: {
    firstName?: string;
    lastName?: string;
  };
};

export default function HelperHome() {
  const router = useRouter();
  const { profile, refetch } = useProfile();

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

  /* ---------- ACTIVE TOGGLE ---------- */
  const toggleActive = async (value: boolean) => {
    if (!profile) return;

    try {
      await api.patch("/profile/helper/status", { isActive: value });
      await refetch();
    } catch (error) {
      console.error("Failed to update helper status", error);
    }
  };

  /* ---------- SOS MODAL ---------- */
  const openSOSModal = (sos: Emergency) => {
    setActiveSOS(sos);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveSOS(null);
  };

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.leftHeader}>
          <Text style={styles.greeting}>{greeting}</Text>
          {profile?.firstName && (
            <Text style={styles.nameText}>
              {profile.firstName} {profile.lastName || ""}
            </Text>
          )}
        </View>

        {/* RIGHT */}
        <View style={styles.rightHeader}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
          />
          {/* <View style={styles.activeRow}>
            <Text style={styles.activeText}>Active</Text>
            <Switch
              value={!!profile?.isActive}
              onValueChange={toggleActive}
            />
          </View>
      <Text style={styles.status}>
        Status: {profile?.isActive ? "Active" : "Inactive"}
      </Text> */}
        </View>
      </View>

      {/* ---------- EMERGENCIES ---------- */}
      {profile?.isActive && sosList.length > 0 && (
        <View style={styles.emergencyBlock}>
          <Text style={styles.emergencyTitle}>Seniors Needing Help</Text>

          {sosList.map((sos) => (
            <TouchableOpacity
              key={sos._id}
              style={styles.sosCard}
              onPress={() => openSOSModal(sos)}
            >
              <Text style={styles.sosName}>
                {sos.seniorProfile?.firstName || "Senior"}{" "}
                {sos.seniorProfile?.lastName || ""}
              </Text>
              <Text style={styles.sosSub}>📞 {sos.user?.phone}</Text>
              <Text style={styles.tapHint}>Tap to view details</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ---------- LINKED SENIORS ---------- */}
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

              <View style={{ flex: 1 }}>
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

      {/* ---------- MODAL ---------- */}
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={closeModal} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Emergency Alert</Text>

          {activeSOS && (
            <>
              <Text style={styles.modalName}>
                {activeSOS.seniorProfile?.firstName || "Senior"}{" "}
                {activeSOS.seniorProfile?.lastName || ""}
              </Text>
              <Text style={styles.modalSub}>📞 {activeSOS.user?.phone}</Text>
            </>
          )}

          <TouchableOpacity style={styles.acceptBtn} onPress={closeModal}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectBtn} onPress={closeModal}>
            <Text style={styles.rejectText}>Ignore</Text>
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

  infoText: {
    fontSize: 14,
    color: "#777",
  },

  emptyCard: {
    backgroundColor: "#F7F7F7",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
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
});
