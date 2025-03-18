// import type { Route } from "./+types/index";

import { DynamicHeader } from "@fund/dynamic-header";
import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import Masonry from "react-masonry-css";
import { NavLink } from "react-router";
import { cn } from "~/utils/cn";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

const EXAMPLE_SOURCES = [
  "https://www.youtube.com/embed/JNFO40e10CA?si=iD9DisOlcqWnAlVQ",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/JNFO40e10CA?si=iD9DisOlcqWnAlVQ",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/JNFO40e10CA?si=iD9DisOlcqWnAlVQ",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/JNFO40e10CA?si=iD9DisOlcqWnAlVQ",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
  "https://www.youtube.com/embed/JNFO40e10CA?si=iD9DisOlcqWnAlVQ",
  "https://www.linkedin.com/embed/feed/update/urn:li:share:7305391310591381504?collapsed=1",
];

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

export default function Home() {
  return (
    <>
      <DynamicHeader title="Home" />
      <div className="container flex flex-col mt-8 gap-8">
        <div className="flex flex-row items-center gap-10">
          <Input
            placeholder="Search tokens or enter <social_media> URL ..."
            className="dark:bg-transparent p-5"
          />
          <Button variant="secondary" className="p-5">
            Search
          </Button>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column flex flex-col gap-y-5"
        >
          {EXAMPLE_SOURCES.map((val, i) => (
            <NavLink
              key={i}
              className="flex flex-col w-full rounded-lg border border-white/50 py-3 px-5 gap-y-3"
              to={`Contract_Address-${i}`}
            >
              <div className="flex flex-col gap-4">
                <p>Title</p>
                <p>Subtitle</p>
              </div>
              <iframe
                className={cn(
                  "rounded-lg h-full w-full overflow-hidden",
                  val.includes("youtube") && "aspect-video",
                  val.includes("linkedin") && "aspect-square"
                )}
                src={val}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                scrolling="no"
              />
              <p className="text-end text-xs">read more ...</p>
            </NavLink>
          ))}
        </Masonry>
      </div>
    </>
  );
}
