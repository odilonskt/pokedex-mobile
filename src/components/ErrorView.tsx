import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorView({ message = "Algo deu errado", onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: { fontSize: 16, color: "#555", marginBottom: 16, textAlign: "center" },
  button: {
    backgroundColor: "#EE1515",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
