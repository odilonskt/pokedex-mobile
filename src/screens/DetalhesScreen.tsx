// src/screens/DetalhesScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../navigation/types";

import { ErrorView } from "../components/ErrorView";
import { Loading } from "../components/Loading";
import { getPokemonDetails } from "../services/api"; // ✅ import adicionado
import { Pokemon } from "../types/pokemon";
import { getTypeColor } from "../utils/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhes">;

export default function DetalhesScreen({ route }: Props) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function carregar() {
      try {
        setLoading(true);
        const data = await getPokemonDetails(id); // ✅ corrigido
        if (isMounted) setPokemon(data);
      } catch {
        if (isMounted) setError("Erro ao carregar detalhes.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    carregar();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loading />;
  if (error || !pokemon)
    return <ErrorView message={error ?? "Pokémon não encontrado."} />;

  const tipoPrincipal = pokemon.types[0]?.type.name ?? "normal";
  const corFundo = getTypeColor(tipoPrincipal);
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  return (
    <ScrollView style={[styles.container, { backgroundColor: corFundo }]}>
      <View style={styles.header}>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>

      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

      <View style={styles.body}>
        <View style={styles.row}>
          {pokemon.types.map((t) => (
            <View
              key={t.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(t.type.name) },
              ]}
            >
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estatísticas</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name}</Text>
            <View style={styles.statBarContainer}>
              <View
                style={[
                  styles.statBar,
                  { width: `${Math.min(s.base_stat, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", paddingTop: 24 },
  id: { color: "#fff", fontWeight: "bold", opacity: 0.8 },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  image: { width: 220, height: 220, alignSelf: "center" },
  body: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 400,
  },
  row: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  typeText: { color: "#fff", fontWeight: "bold", textTransform: "capitalize" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  infoBox: { alignItems: "center" },
  infoLabel: { color: "#666", fontSize: 12 },
  infoValue: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  statName: { width: 90, textTransform: "capitalize", color: "#555" },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  statBar: { height: 8, backgroundColor: "#EE1515", borderRadius: 4 },
  statValue: { width: 36, textAlign: "right", fontWeight: "bold" },
});
