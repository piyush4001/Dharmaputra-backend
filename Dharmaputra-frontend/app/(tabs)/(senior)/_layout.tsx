import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SeniorTabsLayout() {
  const router = useRouter();

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

      {/* ✅ FEEDBACK TAB (REDIRECTS TO GLOBAL PAGE) */}
      <Tabs.Screen
        name="feedback-proxy"
        options={{
          title: "Feedback",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              size={22}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // ⛔ stop normal tab routing
            router.push("/feedback"); // ✅ go to global page
          },
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
    </Tabs>
  );
}
