// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import api from "@/utils/api";
// import * as Location from "expo-location";

// export default function SOSActive() {
//   const router = useRouter();
//   const [seconds, setSeconds] = useState(5);
//   const [cancelled, setCancelled] = useState(false);

//   useEffect(() => {
//     if (seconds === 0 && !cancelled) {
//       sendSOS();
//       return;
//     }

//     const timer = setTimeout(() => {
//       setSeconds((prev) => prev - 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [seconds]);

//   const sendSOS = async () => {
//   try {
//     let location = null;

//     const { status } =
//       await Location.getForegroundPermissionsAsync();

//     if (status === "granted") {
//       const pos = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       location = {
//         latitude: pos.coords.latitude,
//         longitude: pos.coords.longitude,
//       };
//     }

//     console.log("Sending SOS with location:", location);
//     const response = await api.post("/emergency/sos", {
//       location,
//     });
//     console.log("SOS response:", response.data);

//     router.replace("/success/sos");
//   } catch (error: any) {
//     console.error("SOS failed - Full Error:", error);
//     console.error("Response status:", error.response?.status);
//     console.error("Response data:", error.response?.data);
//     console.error("Request URL:", error.config?.url);
//     console.error("Request headers:", error.config?.headers);
//     router.replace("/(tabs)/(senior)/home");
//   }
// };

//   const cancelSOS = () => {
//     setCancelled(true);
//     router.replace("/(tabs)/(senior)/home");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🚨 SOS ACTIVATED</Text>
//       <Text style={styles.timer}>
//         Sending alert in {seconds} seconds
//       </Text>

//       <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
//         <Text style={styles.cancelText}>Cancel SOS</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#B71C1C", // deep emergency red
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#FFFFFF",
//     marginBottom: 16,
//     textAlign: "center",
//     letterSpacing: 1,
//   },

//   timer: {
//     fontSize: 20,
//     color: "#FFEBEE",
//     marginBottom: 40,
//     textAlign: "center",
//   },

//   cancelBtn: {
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 30,
//     minWidth: 200,
//     alignItems: "center",
//     elevation: 4,
//   },

//   cancelText: {
//     color: "#B71C1C",
//     fontSize: 18,
//     fontWeight: "700",
//   },
// });
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Linking,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/api";
// import { Animated } from "react-native";
import { Animated as RNAnimated } from "react-native";

type Responder = {
  _id: string;
  name: string;
  phone: string;
  profileImage?: string;
  role: string;
};

export default function SOSActive() {
  const router = useRouter();
  const [responders, setResponders] = useState<Responder[]>([]);
  const [holding, setHolding] = useState(false);
  // const progress = useRef(new Animated.Value(0)).current;
  const progress = useRef(new RNAnimated.Value(0)).current;

  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   fetchResponders();
  // }, []);
  useEffect(() => {
    // initial fetch
    fetchResponders();

    // poll every 5 seconds
    pollRef.current = setInterval(fetchResponders, 5000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  const fetchResponders = async () => {
    try {
      const res = await api.get("/emergency/family/sos");

      const emergency = res.data?.emergency;

      // Emergency no longer active (cancelled / resolved)
      if (!emergency || emergency.status !== "ACTIVE") {
        if (pollRef.current) clearInterval(pollRef.current);
        router.replace("/(tabs)/(senior)/home");
        return;
      }

      setResponders(emergency.responders || []);
    } catch (err) {
      console.error("Polling active emergency failed", err);
    }
  };

  // 🔴 Hold-to-cancel logic (5 seconds)
  const startHold = () => {
    setHolding(true);

    RNAnimated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    holdTimer.current = setTimeout(cancelEmergency, 5000);
  };

  const stopHold = () => {
    setHolding(false);
    progress.stopAnimation();
    progress.setValue(0);

    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  const cancelEmergency = async () => {
    try {
      await api.post("/emergency/cancel");
      router.replace("/(tabs)/(senior)/home");
    } catch (err) {
      console.error("Cancel emergency failed");
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const renderResponder = ({ item }: { item: Responder }) => (
    <View style={styles.responderCard}>
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : require("@/assets/logo.png")
        }
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.responderName}>{item.name}</Text>
        <Text style={styles.responderRole}>{item.role}</Text>
      </View>

      <Pressable
        style={styles.callBtn}
        onPress={() => Linking.openURL(`tel:${item.phone}`)}
      >
        <Text style={styles.callText}>Call</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />
        <Text style={styles.navTitle}>Emergency Active</Text>
      </View>

      {/* Responders */}
      <FlatList<Responder>
        data={responders}
        keyExtractor={(item) => item._id}
        renderItem={renderResponder}
        ListEmptyComponent={
          <Text style={styles.waitingText}>Waiting for responders...</Text>
        }
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Cancel Hold Button */}
      <View style={styles.cancelContainer}>
        <Pressable
          onPressIn={startHold}
          onPressOut={stopHold}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelText}>Hold 5s to Cancel Emergency</Text>

          <RNAnimated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  navbar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  logo: {
    width: 36,
    height: 36,
    marginRight: 12,
  },

  navTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  waitingText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },

  responderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  responderName: {
    fontSize: 16,
    fontWeight: "700",
  },

  responderRole: {
    fontSize: 12,
    color: "#666",
  },

  callBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  callText: {
    color: "#FFF",
    fontWeight: "700",
  },

  cancelContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },

  cancelBtn: {
    backgroundColor: "#B71C1C",
    borderRadius: 30,
    paddingVertical: 16,
    overflow: "hidden",
  },

  cancelText: {
    color: "#FFF",
    fontWeight: "700",
    textAlign: "center",
    zIndex: 2,
  },

  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
