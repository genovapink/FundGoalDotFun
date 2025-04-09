export function addressTrimer(address: string): string {
  // console.log("address", address);
  return `${address.slice(0, 6)}...${address?.slice(-4)}`;
}
