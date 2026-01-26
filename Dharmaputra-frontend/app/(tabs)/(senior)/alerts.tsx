import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import api from "@/utils/api";

type LinkRequest = {
  _id: string;
  familyName: string;
  familyPhone: string;
  relation: string;
};

export default function SeniorAlerts() {
  const [requests, setRequests] = useState<LinkRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/alerts/senior/link-requests");
        setRequests(res.data || []);
      } catch (error) {
        console.error("Failed to load alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (
    requestId: string,
    action: "APPROVE" | "REJECT",
  ) => {
    try {
      await api.post("/alerts/senior/link-requests/respond", {
        requestId,
        action,
      });

      Alert.alert(
        "Success",
        action === "APPROVE"
          ? "Family member linked successfully"
          : "Request rejected",
      );

      // Remove request from list
      setRequests((prev) =>
        prev.filter((req) => req._id !== requestId),
      );
    } catch (error) {
      console.error("Action failed", error);
      Alert.alert("Error", "Failed to perform action");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Loading alerts...</Text>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No new requests</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Link Requests</Text>
        <Text style={styles.subtitle}>
          Family members requesting to connect with you
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Family Info */}
            <View style={styles.infoBlock}>
              <Text style={styles.name}>{item.familyName}</Text>

              <Text style={styles.text}>
                📞 {item.familyPhone}
              </Text>

              <Text style={styles.text}>
                Relation: {item.relation}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.approve]}
                onPress={() =>
                  handleAction(item._id, "APPROVE")
                }
                activeOpacity={0.9}
              >
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.reject]}
                onPress={() =>
                  handleAction(item._id, "REJECT")
                }
                activeOpacity={0.9}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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

  infoText: {
    fontSize: 14,
    color: "#777",
  },

  /* Header */
  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  infoBlock: {
    marginBottom: 16,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },

  /* Actions */
  actions: {
    flexDirection: "row",
    gap: 12,
  },

  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  approve: {
    backgroundColor: "#2E7D32",
  },

  reject: {
    backgroundColor: "#FDECEA",
  },

  btnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});