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

type FamilyAlert = {
  _id: string;
  status: "APPROVED" | "REJECTED";
  seniorId: {
    firstName?: string;
    lastName?: string;
    phone: string;
  };
};

export default function FamilyAlerts() {
  const [alerts, setAlerts] = useState<FamilyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts/family");
        setAlerts(res.data || []);
      } catch (error) {
        console.error("Failed to load family alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleDelete = (alertId: string) => {
    Alert.alert("Delete Alert", "Are you sure you want to delete this alert?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // 🔥 Backend call
            await api.delete(`/alerts/${alertId}`);

            // 🔥 Update UI
            setAlerts((prev) => prev.filter((alert) => alert._id !== alertId));
          } catch (error) {
            console.error("Failed to delete alert", error);
            Alert.alert("Error", "Failed to delete alert");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Loading alerts...</Text>
      </View>
    );
  }

  if (alerts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No notifications yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>
          Updates from seniors you are connected with
        </Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const seniorName = `${item.seniorId.firstName || "Senior"} ${
            item.seniorId.lastName || ""
          }`;

          const isApproved = item.status === "APPROVED";

          return (
            <View
              style={[
                styles.card,
                isApproved ? styles.approvedCard : styles.rejectedCard,
              ]}
            >
              {/* Status + Delete */}
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.statusText,
                    isApproved
                      ? styles.approvedText
                      : styles.rejectedText,
                  ]}
                >
                  {isApproved ? "Approved" : "Rejected"}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.message}>
                {seniorName} has{" "}
                {isApproved ? "approved" : "rejected"} your request
              </Text>

              <Text style={styles.phone}>
                📞 {item.seniorId.phone}
              </Text>
            </View>
          );
        }}
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  approvedCard: {
    backgroundColor: "#F1F8F4",
    borderLeftWidth: 5,
    borderLeftColor: "#2E7D32",
  },

  rejectedCard: {
    backgroundColor: "#FDECEA",
    borderLeftWidth: 5,
    borderLeftColor: "#B71C1C",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },

  approvedText: {
    color: "#2E7D32",
  },

  rejectedText: {
    color: "#B71C1C",
  },

  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },

  message: {
    fontSize: 15,
    color: "#111",
    marginBottom: 6,
  },

  phone: {
    fontSize: 13,
    color: "#555",
  },
});
