import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
};

export default function AppMenu({ visible, onClose, onSelect }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.drawer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <MenuItem
          label="User Manual"
          icon="book-outline"
          onPress={() => onSelect("manual")}
        />

        <MenuItem
          label="About Us"
          icon="information-circle-outline"
          onPress={() => onSelect("about")}
        />

        <MenuItem
          label="Contact Us"
          icon="call-outline"
          onPress={() => onSelect("contact")}
        />

        <View style={styles.divider} />

        <MenuItem
          label="Delete Account"
          icon="trash-outline"
          danger
          onPress={() => onSelect("delete")}
        />
      </View>
    </Modal>
  );
}

/* ---------------- MENU ITEM ---------------- */

function MenuItem({
  label,
  icon,
  onPress,
  danger = false,
}: {
  label: string;
  icon: any;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} color={danger ? "#C62828" : "#333"} />
      <Text style={[styles.itemText, danger && styles.dangerText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "75%",
    backgroundColor: "#FFF",
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  itemText: {
    fontSize: 16,
    marginLeft: 14,
    color: "#333",
  },

  dangerText: {
    color: "#C62828",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },
});
