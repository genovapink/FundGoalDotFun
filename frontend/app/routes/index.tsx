import { useEffect, useState, type ReactNode } from "react";
import { ButtonMagnet, ForwardLink } from "@fund/button";
import { DynamicHeader } from "@fund/dynamic-header";
import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import Masonry from "react-masonry-css";
import { NavLink, useFetcher, useLoaderData } from "react-router";
import { cn } from "~/utils/cn";
import { X } from "lucide-react";
import type { Route } from "./+types";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

export function meta() {
  return [
    { title: "Gofunding" },
    { name: "description", content: "Gofunding" },
    { name: "image", content: "/logo.png" },
    { name: "og:image", content: "/logo.png" },
    { name: "twitter:image", content: "/logo.png" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q");
  const page = Number(searchParams.get("page")) + 1 || 1;

  const apiUrl = searchTerm
    ? `${process.env.VITE_BE_URL}/api/tokens?q=${encodeURIComponent(searchTerm)}&page=${page}`
    : `${process.env.VITE_BE_URL}/api/tokens`;

  const response = await fetch(apiUrl);
  const data = await response.json();
  return { data };
}

export default function Home() {
  const fetcher = useFetcher<Record<string, ReactNode>>();
  const loaderData = useLoaderData();

  const [data, setData] = useState<{
    tokens: Record<string, ReactNode>[];
    shouldLoadMore: boolean;
  }>({
    tokens: loaderData.data.items,
    shouldLoadMore: loaderData.data.shouldLoadMore,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);

  const handleFetch = async () => {
    setIsLoading(true);
    fetcher.load(`/api/list?q=${encodeURIComponent(searchTerm)}&page=${searchTerm ? 1 : page}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    setPage(1);
    await handleFetch();
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
  };

  const handleClearSearch = () => {
    setPage(1);
    setSearchTerm("");
    setIsLoading(true);
    fetcher.load("/api/list");
  };

  const handleOnNextPage = async () => {
    await handleFetch();
  };

  useEffect(() => {
    if (fetcher.state == "idle" && fetcher.data) {
      setIsLoading(false);

      if (searchTerm) {
        setData({
          tokens: fetcher.data!.items as Record<string, ReactNode>[],
          shouldLoadMore: fetcher.data!.shouldLoadMore as boolean,
        });
      } else {
        setPage(page + 1);
        setData((old) => {
          return {
            tokens: [...old.tokens, ...(fetcher.data!.items as Record<string, ReactNode>[])],
            shouldLoadMore: fetcher.data!.shouldLoadMore as boolean,
          };
        });
      }
    }
  }, [fetcher]);

  useEffect(() => {
    const timeo = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(timeo);
    }, 200);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 bg-white/20 rounded-full animate-ping"></div>
          </div>
          <p className="text-xl font-semibold">Fetching Tokens...</p>
          <p className="text-sm text-gray-400 animate-pulse">
            Hang tight, loading your decentralized goodness!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container flex flex-col mt-8 gap-8">
        <div className="flex flex-row items-center gap-10">
          <div className="relative w-full">
            <Input
              placeholder="Search tokens or enter <social_media> URL ..."
              className="dark:bg-transparent p-5 pr-10"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            )}
          </div>
          <Button variant="secondary" className="p-5" onClick={handleSearch}>
            Search
          </Button>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column flex flex-col gap-y-5"
        >
          {data.tokens.map((token, i) => {
            const iframeSrc = String(token.postUrl!);
            return (
              <NavLink
                key={i}
                className="flex flex-col w-full rounded-lg border border-white/50 py-3 px-5 gap-y-3"
                to={String(token.contractAddress)}
              >
                <div className="flex flex-col gap-4">
                  <p className="font-bold text-xl">
                    {token.name} ({token.ticker || token.symbol || "N/A"})
                  </p>
                  <p>{token.description || "No description available"}</p>
                </div>
                <iframe
                  className={cn(
                    "rounded-lg h-full w-full overflow-hidden",
                    iframeSrc.includes("youtube") && "aspect-video",
                    iframeSrc.includes("linkedin") && "aspect-square"
                  )}
                  src={iframeSrc}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  scrolling="no"
                />
                <p className="flex text-inherit justify-end">
                  <ForwardLink className="justify-end" to={String(token.contractAddress)}>
                    More
                  </ForwardLink>
                </p>
              </NavLink>
            );
          })}
        </Masonry>
        {data.shouldLoadMore && (
          <div className="flex w-full justify-center mt-12 mb-36">
            <ButtonMagnet size={"lg"} onClick={handleOnNextPage}>
              Load More
            </ButtonMagnet>
          </div>
        )}
      </div>
    </>
  );
}
