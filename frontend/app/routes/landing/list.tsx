import type { Route } from "../+types";

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q");

  const page = Number(searchParams.get("page")) + 1 || 1;

  const apiUrl = searchTerm
    ? `${import.meta.env.VITE_BE_URL}/api/solana-tokens?q=${encodeURIComponent(searchTerm)}&page=${page}`
    : `${import.meta.env.VITE_BE_URL}/api/solana-tokens?page=${page}`;

  const list = await fetch(apiUrl).then((res) => res.json());

  return list;
}