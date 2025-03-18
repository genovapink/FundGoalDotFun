import { ClientOnly } from "remix-utils/client-only";
import { useFundWallet } from "./provider";
import { ButtonMagnet } from "@fund/button";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shadcn/dialog";
import { useEffect, useState } from "react";
import { Button } from "@shadcn/button";

export function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const { connectors, isConnected, address, disconnect } = useFundWallet();

  useEffect(() => {
    if (isConnected && address) {
      setIsOpen(false);
    }
  }, [isConnected, address]);

  return (
    <>
      {isConnected ? (
        <ClientOnly>
          {() => (
            <ButtonMagnet onClick={disconnect}>
              <div className="flex flex-row items-center gap-4">
                {address.slice(0, 6)}...{address?.slice(-4)}
                <LogOut className="size-4" />
              </div>
            </ButtonMagnet>
          )}
        </ClientOnly>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ClientOnly>
              {() => <ButtonMagnet onClick={() => setIsOpen(true)}>Connect Wallet</ButtonMagnet>}
            </ClientOnly>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <div className="flex flex-col gap-10 my-10">
                {connectors.map((connector) => (
                  <Button key={connector.id} onClick={() => connector.connect()} className="py-5">
                    {connector.icon && <img src={connector.icon} className="size-7" />}
                    {connector.name}
                  </Button>
                ))}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
