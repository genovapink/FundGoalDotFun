import { Button } from "@shadcn/button";
import { AlertCircle, Check, X } from "lucide-react";

type ModalCreate = {
  name: string;
  ticker: string;
  initialBuyAmount: number;
  initialTokens: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalCreate({
  name,
  ticker,
  initialBuyAmount,
  initialTokens,
  onConfirm,
  onClose,
}: ModalCreate) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Confirm Token Launch</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-center mb-4 flex items-center justify-center text-amber-500 text-sm sm:text-base">
              <AlertCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Are you sure you want to launch this token?
            </p>

            <div className="border border-input rounded-lg p-4 space-y-4">
              <div className="flex justify-center mb-4">
                {/* {preview ? (
                  <img
                    src={preview}
                    alt="Token logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border border-input"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold">
                      {form.watch("name") ? form.watch("name").charAt(0).toUpperCase() : "T"}
                    </span>
                  </div>
                )} */}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
                <div className="text-muted-foreground">Token Name:</div>
                <div className="font-medium text-right">{name}</div>

                <div className="text-muted-foreground">Ticker:</div>
                <div className="font-medium text-right">{ticker}</div>

                <div className="text-muted-foreground">Total Supply:</div>
                <div className="font-medium text-right">1,000,000,000</div>

                <div className="text-muted-foreground">Initial Buy:</div>
                <div className="font-medium text-right">{initialBuyAmount} EDU</div>

                <div className="text-muted-foreground">Token Amount:</div>
                <div className="font-medium text-right">
                  {initialTokens.toLocaleString()} {ticker}
                </div>
              </div>
            </div>

            <div className="border border-input rounded-lg p-4 space-y-2 text-sm sm:text-base">
              <p className="text-muted-foreground">
                Launch cost: 0.5 EDU (liquidity) + 0.25 EDU (gas)
              </p>
              <p className="text-muted-foreground">Token supply: 1,000,000,000 tokens (fixed)</p>
              <p className="text-muted-foreground">
                You receive 2% of total supply (20,000,000 tokens)
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                • 50% unlocked when market cap reaches $1,000,000
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                • 50% unlocked when market cap reaches $3,000,000
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button type="button" variant="outline" onClick={onClose} className="w-full py-3">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="w-full py-3 bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black font-medium"
              >
                <Check className="mr-2 h-4 w-4" />
                Confirm & Pay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
