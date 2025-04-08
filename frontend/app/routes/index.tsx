import { useEffect, useState } from "react";
import { ButtonMagnet, ForwardLink } from "@fund/button";
import { DynamicHeader } from "@fund/dynamic-header";
import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import Masonry from "react-masonry-css";
import { NavLink } from "react-router";
import { cn } from "~/utils/cn";
import { X } from "lucide-react";

export function meta() {
  return [
    { title: "Gofunding" },
    { name: "description", content: "Gofunding" },
    { name: "image", content: "/logo.png" },
    { name: "og:image", content: "/logo.png" },
    { name: "twitter:image", content: "/logo.png" },
  ];
}

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

const EXAMPLE_SOURCES = [
  "https://www.youtube.com/embed/hz0_f05CXUA?si=vTbARCM3rVIkWHEh",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/hz0_f05CXUA?si=vTbARCM3rVIkWHEh",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/hz0_f05CXUA?si=vTbARCM3rVIkWHEh",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/hz0_f05CXUA?si=vTbARCM3rVIkWHEh",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/hz0_f05CXUA?si=vTbARCM3rVIkWHEh",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
]; // WIP

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = () => {
    fetchTokens(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchTokens();
  };

  const fetchTokens = async (query: string = "") => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BE_URL}/api/tokens${query ? `?q=${encodeURIComponent(query)}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setTokens(Array.isArray(data) ? data : [data]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
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
      <DynamicHeader title="Home" />
      <div className="container flex flex-col mt-8 gap-8">
        <div className="flex flex-row items-center gap-10">
          <div className="relative w-full">
            <Input
              placeholder="Search tokens or enter <social_media> URL ..."
              className="dark:bg-transparent p-5 pr-10"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
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
          {tokens.map((token, i) => {
            const iframeSrc = EXAMPLE_SOURCES[i % EXAMPLE_SOURCES.length];

            return (
              <NavLink
                key={token._id}
                className="flex flex-col w-full rounded-lg border border-white/50 py-3 px-5 gap-y-3"
                to={`Contract_Address-${token.contractAddress || token.address || token._id}`}
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
                <ForwardLink
                  to={`Contract_Address-${token.contractAddress || token.address || token._id}`}
                  className="text-inherit justify-end"
                >
                  More
                </ForwardLink>
              </NavLink>
            );
          })}
        </Masonry>
        <div className="flex w-full justify-center mt-12 mb-36">
          <ButtonMagnet size={"lg"}>Load More</ButtonMagnet>
        </div>
      </div>
    </>
  );
}
