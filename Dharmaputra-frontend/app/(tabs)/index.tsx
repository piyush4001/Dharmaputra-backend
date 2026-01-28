import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import useProfile from "../hooks/useProfile";


export default function TabsIndex() {
  const router = useRouter();
  const { role, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  console.log("Role in tabs index:", role);
  useEffect(() => {
    if (loading || profileLoading) return;
    if (!role && !loading) {
    router.replace("/(role)/choose");
    return;
    }
    
    if (role === "FAMILY" && !profile) {
      router.replace("/(profile)/setup-family");
      return;
    }

    if (role === "SENIOR") {
      router.replace("/(tabs)/(senior)/home");
    } else if (role === "FAMILY") {
      router.replace("/(tabs)/(family)/home");
    } else if (role === "HELPER") {
      router.replace("/(tabs)/(helper)/home");
    }
  },[loading, profileLoading, role, profile]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
