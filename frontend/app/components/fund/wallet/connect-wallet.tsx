import { ClientOnly } from "remix-utils/client-only";
import { useFundWallet } from "./provider";
import { ButtonArrow, ButtonMagnet } from "@fund/button";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";

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
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <ClientOnly>
            {() => <ButtonMagnet onClick={() => setIsOpen(true)}>Connect Wallet</ButtonMagnet>}
          </ClientOnly>
          <DrawerContent className="pb-10">
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="text-center font-bold">Connect a Wallet</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-10">
                {connectors.map((connector) => (
                  <ButtonArrow
                    key={connector.id}
                    onClick={() => connector.connect()}
                    iconB64={connector.icon}
                    direction="left"
                    className="w-max"
                  >
                    {connector.name}
                  </ButtonArrow>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
