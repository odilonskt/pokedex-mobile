import axios from "axios";
import { Pokemon, PokemonListResponse } from "../types/pokemon";

const API_POKEMON = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export async function getPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> {
  const { data } = await API_POKEMON.get<PokemonListResponse>("/pokemon", {
    params: { limit, offset },
  });
  return data;
}

export async function getPokemonDetails(
  nameOrId: string | number,
): Promise<Pokemon> {
  const { data } = await API_POKEMON.get<Pokemon>(`/pokemon/${nameOrId}`);
  return data;
}

export function extractIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}
