import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* ✅ Global Status Bar */}
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <Slot />
    </AuthProvider>
  );
}
