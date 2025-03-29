import type { JSX } from "react";
import type { TableItem } from "..";
import { cn } from "~/utils/cn";
import { ToggleGroup, ToggleGroupItem } from "@shadcn/toggle-group";
import { ChartFund } from "@fund/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";
import { BuySellTabs } from "./buy-sell";
import { ForwardLink } from "@fund/button";
import { Badge } from "@shadcn/badge";
import { Copy } from "lucide-react";

type LayoutMobile = {
  TIME_SERIES: string[];
  data: TableItem[];
} & JSX.IntrinsicElements["div"];

export function LayoutMobile({ TIME_SERIES, data, className }: LayoutMobile) {
  return (
    <div className={cn("mt-6 px-6 lg:px-10", className)}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <p>MCap: $22,833</p>
          <p>price: 0.0000000337 ETH</p>
          <p>liquidity: 123456789 ETH</p>
          <p>remaining: 695,799,225.84</p>
        </div>

        <ToggleGroup type="single" className="flex-wrap">
          {TIME_SERIES.map((val, idx) => (
            <ToggleGroupItem key={idx} value={val} className="text-xs sm:text-sm">
              {val}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

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

        <div className="flex flex-col gap-4">
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
              src="https://www.youtube.com/embed/hz0_f05CXUA?si=vTbARCM3rVIkWHEh"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              scrolling="no"
            />
            <div className="h-[1px] bg-white/50 w-full self-end my-8" />
            <div className="flex flex-row gap-2 items-center">
              <p>creator:</p>
              <Badge variant="secondary">{"<address>"}</Badge>
              <Copy className="size-5 cursor-pointer" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p>ca:</p>
              <Badge>{"<address>"}</Badge>
              <Copy className="size-5 cursor-pointer" />
            </div>
            <div className="h-[1px] bg-white/50 w-full self-start my-8" />
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio earum culpa, cumque
              doloremque laudantium minima, harum voluptatum voluptate, nisi molestias ex accusamus
              modi ipsa nesciunt accusantium pariatur voluptatem officiis! Nam!
            </p>
          </div>
        </div>

        <Table className="overflow-y-auto relative mb-36">
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
            {data.map((invoice) => (
              <TableRow key={invoice.invoice} className="odd:bg-transparent even:bg-white/10">
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
      </div>
    </div>
  );
}
