import { useState } from "react";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";

export async function loader({ params }: Route.LoaderArgs) {
  const addon = "rei";
  const { ca } = params;
  return { ca, addon };
}

export default function Symbol({ loaderData }: Route.ComponentProps) {
  const { addon, ca } = loaderData;
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

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-xs sm:text-sm rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-xs sm:text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-xs sm:text-sm rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );

  return (
    <>
      <DynamicHeader
        titleChild={
          <div className="flex flex-row items-center gap-2 text-sm sm:text-base">
            <img src="https://placehold.co/50" className="size-8 sm:size-10 rounded-full" />
            <p>{"<token_name>"}</p>
          </div>
        }
      />
      <div className="mt-6 mb-24 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            </div>
            <div className="p-4 border border-white/50 rounded-lg">
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

          <div>
            <BuySellTabs />
          </div>

          <div>
            <Table>
              <TableCaption className="text-xs sm:text-sm">
                A list of your recent invoices.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm">Price (TKN)</TableHead>
                  <TableHead className="text-xs sm:text-sm">{"<token_name>"}</TableHead>
                  <TableHead className="text-xs sm:text-sm">ETH</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Tx</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((invoice, idx) => (
                  <TableRow
                    key={`${invoice.invoice}-${idx}`}
                    className="odd:bg-transparent even:bg-white/10"
                  >
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{invoice.paymentStatus}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{invoice.totalAmount}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{invoice.totalAmount}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{invoice.totalAmount}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination />
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-row gap-5">
          <div className="w-3/4 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-5 text-sm">
                  <p>MCap: $22,833</p>
                  <p>price: 0.0000000337 ETH</p>
                  <p>liquidity: 123456789 ETH</p>
                  <p>remaining: 695,799,225.84</p>
                </div>
                <ToggleGroup type="single">
                  {TIME_SERIES.map((val, idx) => (
                    <ToggleGroupItem key={idx} value={val} className="text-sm">
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
            </div>

            <div>
              <Table>
                <TableCaption className="text-sm">A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">User</TableHead>
                    <TableHead className="text-sm">Type</TableHead>
                    <TableHead className="text-sm">Price (TKN)</TableHead>
                    <TableHead className="text-sm">{"<token_name>"}</TableHead>
                    <TableHead className="text-sm">ETH</TableHead>
                    <TableHead className="text-sm">Date</TableHead>
                    <TableHead className="text-right text-sm">Tx</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice, idx) => (
                    <TableRow
                      key={`${invoice.invoice}-${idx}`}
                      className="odd:bg-transparent even:bg-white/10"
                    >
                      <TableCell className="font-medium text-sm">{invoice.invoice}</TableCell>
                      <TableCell className="text-sm">{invoice.paymentStatus}</TableCell>
                      <TableCell className="text-sm">{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-sm">{invoice.totalAmount}</TableCell>
                      <TableCell className="text-sm">{invoice.totalAmount}</TableCell>
                      <TableCell className="text-sm">{invoice.totalAmount}</TableCell>
                      <TableCell className="text-right text-sm">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination />
            </div>
          </div>

          <div className="w-1/4">
            <BuySellTabs />
          </div>
        </div>
      </div>
    </>
  );
}
