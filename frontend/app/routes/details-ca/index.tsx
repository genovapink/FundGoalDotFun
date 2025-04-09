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
import { addressTrimer } from "~/utils/helper";
import { NavLink } from "react-router";

export type TableItem = {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: string;
};

export function meta() {
  return [
    { title: "Details - Gofunding" },
    { name: "description", content: "Detail - Gofunding" },
    { name: "image", content: "/logo.png" },
    { name: "og:image", content: "/logo.png" },
    { name: "twitter:image", content: "/logo.png" },
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

  const invoices = new Array(25).fill({
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  });

  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-12 gap-5 mt-8 px-10 h-screen">
      <div className="col-span-full lg:col-span-8 row-auto lg:row-start-1 w-full">
        <NavLink to="/" className="flex flex-row items-center text-sm gap-x-2 underline">
          <ChevronLeft className="size-4" /> Back
        </NavLink>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-5 text-xs">
            <p>MCap: $22,833</p>
            <p>price: 0.0000000337 ETH</p>
            <p>liquidity: 123456789 ETH</p>
            <p>remaining: 695,799,225.84</p>
          </div>
          <ToggleGroup type="single">
            {TIME_SERIES.map((val, idx) => (
              <ToggleGroupItem key={idx} value={val}>
                {val}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price (TKN)</TableHead>
              <TableHead>{"<token_name>"}</TableHead>
              <TableHead>ETH</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Tx</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices.map((invoice, id) => (
              <TableRow key={id} className="odd:bg-transparent even:bg-white/10">
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
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
          <BuySellTabs />
          <div className="flex flex-col gap-4">
            <ForwardLink className="justify-end" to="/">
              Visit resource
            </ForwardLink>
            <iframe
              className={cn(
                "rounded-lg h-full w-full overflow-hidden",
                "aspect-video"
                // "aspect-square"
              )}
              src={String(loaderData.postUrl)}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              scrolling="no"
            />
            <div className="h-[1px] bg-white/50 w-full self-end my-8" />
            <div className="flex flex-row gap-2 items-center">
              <p>creator:</p>
              <Badge variant="secondary">{"asdasd"}</Badge>
              <Copy className="size-5 cursor-pointer" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p>ca:</p>
              <Badge>{addressTrimer(loaderData.contractAddress)}</Badge>
              <Copy
                className="size-5 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(loaderData.contractAddress)}
              />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p>donate to creator</p>
              <Badge variant="secondary">{addressTrimer(loaderData.donationAddress)}</Badge>
              <Copy
                className="size-5 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(loaderData.donationAddress)}
              />
              <ShowQR address={loaderData.donationAddress} />
            </div>
            <div className="h-[1px] bg-white/50 w-full self-start my-8" />
            <p>{loaderData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
