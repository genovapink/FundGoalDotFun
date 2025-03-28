import { createCookieSessionStorage } from "react-router";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    secrets: ["n3wsecr3t"],
    name: "sugar_session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
});

export async function saveWalletSession(address: string, request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("walletAddress", address);
  return commitSession(session);
}

export async function getWalletSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("walletAddress");
}

export async function clearWalletSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return destroySession(session);
}
