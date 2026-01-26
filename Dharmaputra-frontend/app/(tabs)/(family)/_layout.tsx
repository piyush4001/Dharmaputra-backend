import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FamilyTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // 🎨 Colors
        tabBarActiveTintColor: "#2E7D32", // green
        tabBarInactiveTintColor: "#999",

        // 🧱 Tab bar style
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 64,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },

        // ✍️ Label style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />

      {/* Hidden screen */}
      <Tabs.Screen name="add-senior" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  );
}
