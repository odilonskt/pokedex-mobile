// src/screens/HomeScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ErrorView } from "../components/ErrorView";
import { Loading } from "../components/Loading";
import { PokemonCard } from "../components/PokemonCard";
import { RootStackParamList } from "../navigation/types";
import {
  extractIdFromUrl,
  getPokemonDetails,
  getPokemonList,
} from "../services/api";
import { PokemonListItem } from "../types/pokemon";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const LIMIT = 20;

export default function HomeScreen({ navigation }: Props) {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [busca, setBusca] = useState("");

  const carregarPokemons = useCallback(async (novoOffset = 0) => {
    try {
      if (novoOffset === 0) setLoading(true);
      else setLoadingMore(true);

      const data = await getPokemonList(LIMIT, novoOffset);

      setPokemons((prev) =>
        novoOffset === 0 ? data.results : [...prev, ...data.results],
      );
      setHasMore(!!data.next);
      setOffset(novoOffset);
      setError(null);
    } catch {
      setError("Não foi possível carregar os pokémons.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    carregarPokemons(0);
  }, [carregarPokemons]);

  const carregarMais = () => {
    if (!loadingMore && hasMore) {
      carregarPokemons(offset + LIMIT);
    }
  };

  const buscarPokemon = async () => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      carregarPokemons(0);
      return;
    }

    try {
      setLoading(true);
      const pokemon = await getPokemonDetails(termo); // ✅ corrigido
      navigation.navigate("Detalhes", { id: pokemon.id });
    } catch {
      setError(`Pokémon "${termo}" não encontrado.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && pokemons.length === 0) return <Loading />;
  if (error && pokemons.length === 0)
    return <ErrorView message={error} onRetry={() => carregarPokemons(0)} />;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar pokémon..."
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={buscarPokemon}
          returnKeyType="search"
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() =>
              navigation.navigate("Detalhes", {
                id: Number(extractIdFromUrl(item.url)),
              })
            }
          />
        )}
        contentContainerStyle={styles.list}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  searchContainer: { padding: 16, backgroundColor: "#EE1515" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  list: { paddingVertical: 8 },
});
