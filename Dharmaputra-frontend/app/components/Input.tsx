import { View, Text, TextInput, StyleSheet } from "react-native";

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad";
};

export default function Input({
  label,
  value,
  onChange,
  keyboardType = "default",
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
});
