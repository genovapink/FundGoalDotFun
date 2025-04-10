import { ButtonMagnet, ForwardLink } from "@fund/button";
import { DynamicHeader } from "@fund/dynamic-header";
import {
  TabsOutline,
  TabsOutlineContent,
  TabsOutlineList,
  TabsOutlineTrigger,
} from "@fund/tab/tab-outline";
import { Badge } from "@shadcn/badge";
import { Pencil } from "lucide-react";

export function meta() {
  const title = "User Profile | GoFundingDotFun";
  const description =
    "View a creator's onchain profile on GoFundingDotFun. Track their fundraising tokens, followers, and community impact.";
  const image = "/logo.png";
  const url = "https://gofunding.fun/profile";

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
    { name: "twitter:site", content: "@gofundingdotfun" },

    { name: "theme-color", content: "#3F5F15" },
  ];
}

export default function ProfilePage() {
  return (
    <>
      <DynamicHeader title="Profile" />
      <div className="container mt-8 flex flex-col gap-4">
        <div className="flex flex-row gap-4 justify-center">
          <img
            src="https://placehold.co/50"
            className="aspect-square object-cover rounded-full h-max"
          />
          <div className="flex flex-col gap-1">
            <p>username</p>
            <p>0 followers</p>
            <p>bio</p>
            <ButtonMagnet size="sm">
              <div className="flex flex-row gap-2 items-center">
                <Pencil className="size-4" />
                Edit profile
              </div>
            </ButtonMagnet>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <Badge variant="outline" className="py-2 px-3 mx-auto">
            0x43133f5D7684E24A7CF82D1Bf547ED73493f6c0E
          </Badge>
          <ForwardLink to="/" className="text-end">
            view on etherscan
          </ForwardLink>
        </div>
        <TabsOutline defaultValue="coins-created">
          <TabsOutlineList className="w-full mb-5">
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
          <TabsOutlineContent value="coins-created" className="flex flex-col gap-10">
            <p className=" italic">soon</p>
          </TabsOutlineContent>
          <TabsOutlineContent value="followers" className="flex flex-col gap-10">
            <p className=" italic">soon</p>
          </TabsOutlineContent>
          <TabsOutlineContent value="following" className="flex flex-col gap-10">
            <p className=" italic">soon</p>
          </TabsOutlineContent>
        </TabsOutline>
      </div>
    </>
  );
}
