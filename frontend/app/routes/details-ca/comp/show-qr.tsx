import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import QRCode from "react-qr-code";

type ShowQRProps = {
  address: string;
};

export function ShowQR({ address }: ShowQRProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <ClientOnly>
        {() => (
          <p
            onClick={() => setIsOpen(true)}
            className="underline italic text-blue-500 text-xs cursor-pointer"
          >
            show qr
          </p>
        )}
      </ClientOnly>
      <DrawerContent className="pb-10">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center font-bold">Donate to creator</DrawerTitle>
          </DrawerHeader>
          <div className="p-5 bg-foreground rounded-lg">
            <QRCode
              className="aspect-square rounded-lg"
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={address}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
