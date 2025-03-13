// import type { Route } from "./+types/index";

import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import Masonry from "react-masonry-css";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

const images = [
  "https://placehold.co/40x50",
  "https://placehold.co/100",
  "https://placehold.co/100",
  "https://placehold.co/40x50",
  "https://placehold.co/100x90",
  "https://placehold.co/100",
  "https://placehold.co/100",
  "https://placehold.co/40x50",
  "https://placehold.co/100",
  // "https://placehold.co/40x50",
  "https://placehold.co/40x50",
  "https://placehold.co/100",
];

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

export default function Home() {
  return (
    <div className="flex flex-col mt-12 gap-8">
      <p>Home</p>
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
        columnClassName="my-masonry-grid_column"
      >
        {images.map((val, i) => (
          <div
            key={i}
            className="flex flex-col w-full rounded-lg border border-white/50 py-3 px-5 gap-y-3"
          >
            <div className="flex flex-col gap-4">
              <p>Title</p>
              <p>Subtitle</p>
            </div>
            <img className="w-full rounded-lg" src={val} />
            <p className="text-end text-xs">read more ...</p>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
