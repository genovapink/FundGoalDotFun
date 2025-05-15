import { ButtonMagnet, ForwardLink } from "@fund/button";
import { DynamicHeader } from "@fund/dynamic-header";
import {
  TabsOutline,
  TabsOutlineContent,
  TabsOutlineList,
  TabsOutlineTrigger,
} from "@fund/tab/tab-outline";
import { useWallet } from "@solana/wallet-adapter-react";
import { Badge } from "@shadcn/badge";
import { Pencil } from "lucide-react";

if (window.ethereum) {
  Object.freeze(window.ethereum);
}

export function meta() {
  const title = "User Profile | FundGoalDotFun";
  const description =
    "View a creator's onchain profile on FundGoalDotFun. Track their fundraising tokens, followers, and community impact.";
  const image = "/logo.png";
  const url = "https://fundgoal.fun/profile";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "profile" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: "@fundgoaldotfun" },
    { name: "theme-color", content: "#3F5F15" },
  ];
}

export default function ProfilePage() {
  const { publicKey } = useWallet();

  return (
    <div className="container mt-8 flex flex-col gap-6">
      <DynamicHeader title="Your Onchain Profile" />

      <div className="flex flex-row items-center gap-6 justify-center">
        <img
          src="https://placehold.co/80x80"
          alt="Profile"
          className="rounded-full object-cover"
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">username</p>
          <p className="text-sm text-muted">0 followers</p>
          <p className="text-sm italic">bio</p>
          <ButtonMagnet size="sm" className="mt-2 w-fit">
            <div className="flex flex-row items-center gap-2">
              <Pencil className="size-4" />
              Edit profile
            </div>
          </ButtonMagnet>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Badge variant="outline" className="py-2 px-4">
          {publicKey ? publicKey.toBase58() : "Connect Wallet"}
        </Badge>
        {publicKey && (
          <ForwardLink
            to={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}
            className="text-sm text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Solana Explorer
          </ForwardLink>
        )}
      </div>

      <TabsOutline defaultValue="coins-created" className="mt-6">
        <TabsOutlineList className="w-full mb-4 justify-center gap-4">
          <TabsOutlineTrigger value="coins-created" className="capitalize">
            Coins Created
          </TabsOutlineTrigger>
          <TabsOutlineTrigger value="followers" className="capitalize">
            Followers
          </TabsOutlineTrigger>
          <TabsOutlineTrigger value="following" className="capitalize">
            Following
          </TabsOutlineTrigger>
        </TabsOutlineList>

        <TabsOutlineContent value="coins-created" className="text-center">
          <p className="italic text-gray-500">Coming soon...</p>
        </TabsOutlineContent>

        <TabsOutlineContent value="followers" className="text-center">
          <p className="italic text-gray-500">Coming soon...</p>
        </TabsOutlineContent>

        <TabsOutlineContent value="following" className="text-center">
          <p className="italic text-gray-500">Coming soon...</p>
        </TabsOutlineContent>
      </TabsOutline>
    </div>
  );
}