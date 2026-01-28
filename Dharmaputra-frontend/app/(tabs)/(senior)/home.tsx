import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback, useRef } from "react";
import * as Location from "expo-location";
import api from "@/utils/api";
import useProfile from "../../hooks/useProfile";

type FamilyMember = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export default function SeniorHome() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  const [greeting, setGreeting] = useState("Good Day");
  const [locationSharing, setLocationSharing] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyModalVisible, setFamilyModalVisible] = useState(false);

const sosTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sosHolding, setSosHolding] = useState(false);

  /* ---------------- GREETING ---------------- */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  /* ---------------- LOCATION PERMISSION ---------------- */
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationSharing(status === "granted");
      setCheckingLocation(false);
    };
    checkPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationSharing(status === "granted");

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Location access is needed for emergency safety."
      );
    }
  };

  /* ---------------- FETCH FAMILY MEMBERS ---------------- */
  const fetchFamilyMembers = useCallback(async () => {
    try {
      const res = await api.get("/profile/senior/family");
      setFamilyMembers(res.data || []);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to load family members"
        );
      }
      setFamilyMembers([]);
    }
  }, []);

  useEffect(() => {
    fetchFamilyMembers();
  }, [fetchFamilyMembers]);

  /* ---------------- TRIGGER SOS ---------------- */
  const triggerSOS = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      await api.post("/emergency/sos", {
        lat,
        lng,
      });

      router.push("/(emergency)/sos-active");
    } catch (error: any) {
      Alert.alert(
        "Emergency Failed",
        error.response?.data?.message || "Unable to trigger SOS"
      );
    }
  };

  /* ---------------- SOS HOLD ---------------- */
  const startSOSHold = () => {
    setSosHolding(true);

    sosTimerRef.current = setTimeout(async () => {
      setSosHolding(false);
      await triggerSOS();
    }, 3000);
  };

  const cancelSOSHold = () => {
    setSosHolding(false);
    if (sosTimerRef.current) {
      clearTimeout(sosTimerRef.current);
      sosTimerRef.current = null;
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const callFamily = () => {
    if (!familyMembers.length) {
      Alert.alert("No Family Linked", "No family member is linked yet.");
      return;
    }
    Linking.openURL(`tel:${familyMembers[0].phone}`);
  };

  const handleUnlink = (familyId: string) => {
    Alert.alert(
      "Unlink Family Member",
      "Are you sure you want to unlink this family member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post("/profile/unlink", {
                targetUserId: familyId,
              });
              Alert.alert("Success", "Family member unlinked successfully");
              setTimeout(() => fetchFamilyMembers(), 500);
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to unlink"
              );
            }
          },
        },
      ]
    );
  };

  const name =
    profile?.firstName || profile?.lastName
      ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
      : null;

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          {name && <Text style={styles.name}>{name}</Text>}
          {loading && <Text style={styles.loading}>Loading profile…</Text>}
        </View>

        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* SOS BUTTON */}
      <TouchableOpacity
        style={[styles.sosButton, sosHolding && { opacity: 0.85 }]}
        activeOpacity={1}
        onPressIn={startSOSHold}
        onPressOut={cancelSOSHold}
      >
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSubText}>
          {sosHolding ? "Hold for 3 seconds…" : "Press & hold in emergency"}
        </Text>
      </TouchableOpacity>

      {/* LOCATION STATUS */}
      <TouchableOpacity
        style={styles.statusCard}
        onPress={!locationSharing ? requestLocationPermission : undefined}
      >
        <Text style={styles.statusText}>
          📍 Location Sharing:{" "}
          <Text
            style={{
              color: locationSharing ? "#2E7D32" : "#D32F2F",
              fontWeight: "700",
            }}
          >
            {checkingLocation
              ? "Checking…"
              : locationSharing
              ? "Active"
              : "Inactive (Tap to Enable)"}
          </Text>
        </Text>
      </TouchableOpacity>

      {/* FAMILY PREVIEW */}
      {familyMembers.length > 0 && (
        <TouchableOpacity
          style={styles.familyPreview}
          onPress={() => setFamilyModalVisible(true)}
        >
          <Text style={styles.familyLabel}>👨‍👩‍👧 Family Contact</Text>
          <Text style={styles.familyName}>
            {familyMembers[0]?.firstName || "Family"}{" "}
            {familyMembers[0]?.lastName || ""}
          </Text>
          <Text style={styles.familyPhone}>
            📞 {familyMembers[0].phone}
          </Text>
        </TouchableOpacity>
      )}

      {/* FAMILY MODAL */}
      <Modal
        visible={familyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFamilyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Linked Family Members</Text>

            <FlatList
              data={familyMembers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.memberRow}>
                  <View>
                    <Text style={styles.memberName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.memberPhone}>📞 {item.phone}</Text>
                    <TouchableOpacity
                      onPress={() => handleUnlink(item._id)}
                      style={{ marginTop: 6 }}
                    >
                      <Text style={{ color: "#B71C1C", fontWeight: "600" }}>
                        Unlink
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  >
                    <Text style={styles.callNow}>Call</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFamilyModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
  },
  name: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
    fontWeight: "500",
  },
  loading: {
    fontSize: 13,
    color: "#777",
  },
  logo: {
    width: 40,
    height: 40,
  },
  sosButton: {
    alignSelf: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#D32F2F",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    marginBottom: 28,
  },
  sosText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
  },
  sosSubText: {
    color: "#FFECEC",
    fontSize: 13,
    marginTop: 6,
  },
  statusCard: {
    alignSelf: "center",
    backgroundColor: "#F7F7F7",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 15,
    color: "#333",
  },
  familyPreview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  familyLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
  },
  familyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  familyPhone: {
    fontSize: 15,
    color: "#444",
    marginTop: 4,
  },

  familyMore: {
    marginTop: 6,
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
  },

  actions: {
    width: "100%",
  },

  callBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  callText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  secondaryText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
  },

  memberPhone: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  callNow: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 15,
  },

  closeBtn: {
    marginTop: 16,
    alignSelf: "center",
  },
  closeText: {
    fontSize: 16,
    color: "#D32F2F",
    fontWeight: "600",
  },
});
