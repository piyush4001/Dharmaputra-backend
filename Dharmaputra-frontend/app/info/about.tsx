// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { TouchableOpacity } from "react-native";

// export default function AboutUs() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>
//         <Text style={styles.title}>About Us</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Content */}
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.text}>
//           Dharmaputra is built to ensure the safety, dignity, and well-being of
//           seniors by connecting them with trusted family members and helpers.
//           {"\n\n"}
//           Our mission is to provide timely assistance, emergency support, and
//           peace of mind through technology designed with care and empathy.
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
///
//
//
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function AboutUs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.title}>About Us</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo2.png")}
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

        {/* About Card */}
        <View style={styles.card}>
          <Text style={styles.aboutText}>
            Dharamaputra is a purpose-driven app built to support and empower
            senior citizens with care, dignity, and ease. Designed and developed
            by Students of SGSITS college Indore{" "}
            <Text style={styles.bold}>Krishnapal Sonaniya</Text> and{" "}
            <Text style={styles.bold}>Piyush Soni</Text>, under the guidance of{" "}
            <Text style={styles.bold}>Dr. Puja Gupta</Text> and{" "}
            <Text style={styles.bold}>Dr. C. P. Sengar</Text>, the app bridges
            technology with compassion.
            {"\n\n"}
            Dharamaputra focuses on simplifying daily challenges faced by
            seniors, offering reliable assistance, accessibility, and peace of
            mind. Our mission is to use thoughtful technology to create a safer,
            more connected, and respectful digital environment for the elderly.
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
    width: 140,
    height: 140,
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
    marginBottom: 6,
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

  aboutText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#333",
  },

  bold: {
    fontWeight: "700",
    color: "#000",
  },
});
