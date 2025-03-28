import { DynamicHeader } from "@fund/dynamic-header";
import { ChartFund } from "@fund/chart";
import { ToggleGroup, ToggleGroupItem } from "@shadcn/toggle-group";
import { BuySellTabs } from "./comp/buy-sell";
import type { Route } from "./+types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";

export async function loader({ params }: Route.LoaderArgs) {
  const addon = "rei";

  const { ca } = params;

  return {
    ca,
    addon,
  };
}

export default function Symbol({ loaderData }: Route.ComponentProps) {
  const { addon, ca } = loaderData;

  const TIME_SERIES = ["1m", "5m", "30m", "1h", "4h", "1w"];

  const invoices = new Array(25).fill({
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  });

  return (
    <>
      <DynamicHeader
        titleChild={
          <div className="flex flex-row items-center gap-2 text-base">
            <img src="https://placehold.co/50" className="size-10 rounded-full" />
            <p>{"<token_name>"}</p>
          </div>
        }
      />
      <div className="mt-8 mb-36 px-10 flex flex-row gap-5">
        <div className="w-3/4 flex flex-col gap-10">
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

          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
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
              {invoices.map((invoice) => (
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

        <div className="w-1/4">
          <BuySellTabs />
        </div>
      </div>
    </>
  );
}
