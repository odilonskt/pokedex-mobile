// src/components/PokemonCard.tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { extractIdFromUrl } from "../services/api";
import { PokemonListItem } from "../types/pokemon";

type Props = {
  pokemon: PokemonListItem;
  onPress: () => void;
};

export function PokemonCard({ pokemon, onPress }: Props) {
  const id = extractIdFromUrl(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.id}>#{id.padStart(3, "0")}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: { width: 70, height: 70 },
  info: { marginLeft: 12 },
  id: { color: "#999", fontSize: 12, fontWeight: "bold" },
  name: { fontSize: 18, fontWeight: "bold", textTransform: "capitalize" },
});
