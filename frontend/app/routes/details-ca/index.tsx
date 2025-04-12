import type { Route } from "./+types";
import { useState } from "react";
import { ChartFund } from "@fund/chart";
import { ToggleGroup, ToggleGroupItem } from "@shadcn/toggle-group";
import { BuySellTabs } from "./comp/buy-sell";
import { Pagination } from "./comp/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";
import { cn } from "~/utils/cn";
import { ForwardLink } from "@fund/button";
import { Badge } from "@shadcn/badge";
import { ChevronLeft, Copy } from "lucide-react";
import { ShowQR } from "./comp/show-qr";
import { addressTrimer, generateAddress } from "~/utils/helper";
import { NavLink } from "react-router";

export type TableItem = {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMEDUod: string;
};

export function meta() {
  const title = "Token Details | GoFundingDotFun";
  const description =
    "View token information, transaction activity, and market data for community-funded projects on GoFundingDotFun.";
  const image = "/logo.png";
  const url = "https://gofunding.fun";

  return [
    { title },
    { name: "description", content: description },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
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

export async function loader({ params }: Route.LoaderArgs) {
  const { ca } = params;
  const token = await fetch(`${process.env.VITE_BE_URL}/api/tokens/${ca}`).then((r) => r.json());

  // return {token};
  return token;
}

export default function Symbol({ loaderData }: Route.ComponentProps) {
  // const { token } = loaderData;

  const TIME_SERIES = ["1m", "5m", "30m", "1h", "4h", "1w"];

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const invoices = Array.from({ length: 20 }, () => ({
    user: generateAddress().substring(0, 10) + "...",
    type: Math.random() > 0.5 ? "Buy" : "Sell",
    price: parseFloat((Math.random() * 0.0001 + 0.000001).toFixed(8)),
    volume: parseFloat((Math.random() * 0.00001 + 0.000001).toFixed(8)),
    edu: parseFloat((Math.random() * 0.00001 + 0.000001).toFixed(8)),
    date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)) // random within 30 days
      .toISOString()
      .split("T")[0]
      .replace(/-/g, " - "),
    tx: `0x${Math.random().toString(16).substring(2, 10)}...`,
  }));

  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-12 px-4 sm:px-6 lg:px-10 min-h-screen">
      <div className="col-span-full lg:col-span-8">
        <NavLink to="/" className="flex flex-row items-center text-sm gap-x-2 underline mb-4">
          <ChevronLeft className="size-4" /> Back
        </NavLink>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
            <p>Market Cap: $22,833</p>
            <p>Price: 0.0000000337 EDU</p>
            <p>Liquidity: 123456789 EDU</p>
            <p>Remaining: 695,799,225.84 {loaderData.ticker}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <ToggleGroup type="single">
              {TIME_SERIES.map((val, idx) => (
                <ToggleGroupItem key={idx} value={val}>
                  {val}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-8 row-auto lg:row-start-2 w-full">
        <div className="p-5 border border-white/50 rounded-lg">
          <ChartFund
            data={[
              { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
              { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
              { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
              { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
              { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
              { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
              { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
              { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
              { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
              { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
            ]}
          />
        </div>
      </div>

      <div className="col-span-full lg:col-span-8 row-start-4 lg:row-start-3 w-full">
        <Table className="overflow-y-auto relative">
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price (EDU)</TableHead>
              <TableHead>{loaderData.ticker}</TableHead>
              <TableHead>EDU</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices.map((invoice, id) => (
              <TableRow key={id} className="odd:bg-transparent even:bg-white/10">
                <TableCell className="font-medium">{invoice.user}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>{invoice.price}</TableCell>
                <TableCell>{invoice.volume}</TableCell>
                <TableCell>{invoice.edu}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <a
                    href={`https://opencampus-codex.blockscout.com/tx/${invoice.tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate block text-blue-500 hover:underline"
                    title={invoice.tx}
                  >
                    {invoice.tx}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          className="mb-36"
          onBack={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      <div className="col-span-full lg:col-span-4 row-auto lg:row-start-1 lg:row-end-4 w-full">
        <div className="flex flex-col gap-10">
          <BuySellTabs
            contractAddress={loaderData.contractAddress}
            imageUrl={loaderData.imageUrl}
            bondingCurveAddress={loaderData.bondingCurveAddress}
          />
          <div className="flex flex-col gap-4">
            <ForwardLink className="justify-end" to="/">
              Visit resource
            </ForwardLink>
            <iframe
              className={cn("rounded-lg h-full w-full overflow-hidden", "aspect-video")}
              src={String(loaderData.postUrl)}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              scrolling="no"
            />
            <div className="h-[1px] bg-white/50 w-full self-end my-8" />
            <div className="flex flex-row gap-2 items-center">
              <p>Name:</p>
              <Badge variant="secondary">{loaderData.name}</Badge>
              <Copy className="size-5 cursor-pointer" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p>Contract Address:</p>

              <a
                href={`https://edu-chain-testnet.blockscout.com/address/${loaderData.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="cursor-pointer">
                  {addressTrimer(loaderData.contractAddress)}
                </Badge>
              </a>

              <Copy
                className="size-5 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(loaderData.contractAddress)}
              />
            </div>
            {loaderData.donationAddress && (
              <div className="flex flex-row gap-2 items-center">
                <p>Donate to Creator</p>
                <Badge variant="secondary">{addressTrimer(loaderData.donationAddress)}</Badge>
                <Copy
                  className="size-5 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(loaderData.donationAddress)}
                />
                <ShowQR address={loaderData.donationAddress} />
              </div>
            )}
            <div className="h-[1px] bg-white/50 w-full self-start my-8" />
            <p>Description:</p>
            <p>{loaderData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
