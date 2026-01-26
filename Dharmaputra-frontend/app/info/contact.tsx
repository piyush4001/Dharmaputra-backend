// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { TouchableOpacity } from "react-native";

// export default function ContactUs() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>
//         <Text style={styles.title}>Contact Us</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Content */}
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.text}>
//           📧 Email: support@dharmaputra.in{"\n\n"}
//           📞 Phone: +91 98765 43210{"\n\n"}
//           🏢 Address:{"\n"}
//           Dharmaputra Foundation{"\n"}
//           New Delhi, India
//         </Text>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderColor: "#EEE",
//   },

//   title: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   content: {
//     padding: 24,
//   },

//   text: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#333",
//   },
// });
//
//
//
//
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function ContactUs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.title}>Contact Us</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.appName}>Dharamaputra</Text>

          <Text style={styles.associationText}>In association with</Text>

          <Image
            source={require("../../assets/lions.png")}
            style={styles.partnerLogo}
            resizeMode="contain"
          />
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.description}>
            We’re here to help and happy to hear from you. If you have
            questions, feedback, or need support using Dharamaputra, please feel
            free to reach out.
          </Text>

          <View style={styles.section}>
            <Ionicons name="mail-outline" size={20} color="#333" />
            <Text style={styles.sectionText}>support@dharamaputra.app</Text>
          </View>

          <View style={styles.section}>
            <Ionicons name="call-outline" size={20} color="#333" />
            <Text style={styles.sectionText}>+91-XXXXXXXXXX</Text>
          </View>

          <View style={styles.section}>
            <Ionicons name="location-outline" size={20} color="#333" />
            <Text style={styles.sectionText}>
              [Your Institution / Organization Name]{"\n"}India
            </Text>
          </View>

          <View style={styles.section}>
            <Ionicons name="time-outline" size={20} color="#333" />
            <Text style={styles.sectionText}>
              Monday – Friday: 9:00 AM to 6:00 PM
            </Text>
          </View>

          <Text style={styles.footerText}>
            Your feedback helps us improve and serve seniors better. We aim to
            respond promptly and responsibly to every query.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  content: {
    padding: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },

  associationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  partnerLogo: {
    width: 120,
    height: 60,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    marginBottom: 16,
  },

  section: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },

  sectionText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    flex: 1,
  },

  footerText: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
  },
});
