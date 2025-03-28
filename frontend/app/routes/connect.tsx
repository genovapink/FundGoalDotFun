import { clearWalletSession, saveWalletSession } from "@services/cookie";
import type { Route } from "./+types";
import { redirectDocument } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const { address, disconnect } = await request.json();

  if (typeof disconnect != "undefined" && disconnect == "") {
    const session = await clearWalletSession(request);

    console.log("dia masuk ke disconnect");
    return redirectDocument("/", {
      status: 302,
      headers: {
        "Set-Cookie": session,
      },
    });
  }

  if (!address) {
    return new Response(JSON.stringify({ error: "No address provided" }), { status: 400 });
  }

  console.log("dia masuk ke address");

  const session = await saveWalletSession(address, request);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": session,
    },
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  console.log("dia masuk loader");
  return redirectDocument("/", {
    status: 302,
  });
}
