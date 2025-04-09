export function addressTrimer(address: string): string {
  // console.log("address", address);
  return `${address.slice(0, 6)}...${address?.slice(-4)}`;
}

export const generateAddress = () =>
  `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
