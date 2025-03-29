import { DynamicHeader } from "@fund/dynamic-header";
import type { Route } from "./+types";
import { useState } from "react";
import { LayoutDesktop } from "./comp/desktop";
import { LayoutMobile } from "./comp/mobile";

export type TableItem = {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: string;
};

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
    <>
      <DynamicHeader
        titleChild={
          <div className="flex flex-row items-center gap-2 text-base">
            <img src="https://placehold.co/50" className="size-10 rounded-full" />
            <p>{"<token_name>"}</p>
          </div>
        }
      />

      <LayoutDesktop
        className="hidden lg:flex"
        TIME_SERIES={TIME_SERIES}
        data={paginatedInvoices}
      ></LayoutDesktop>

      {/* <LayoutMobile></LayoutMobile> */}
    </>
  );
}
