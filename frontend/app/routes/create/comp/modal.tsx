import { AlertCircle, Check, X } from "lucide-react";
import React from "react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  formData: {
    name: string;
    ticker: string;
    initialBuyAmount: string;
    initialTokens: number;
  };
  image?: File | null;
}

export const ConfirmLaunchModal: React.FC<Props> = ({
  onClose,
  onConfirm,
  isLoading,
  formData,
  image,
}) => {
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
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Token logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border border-input"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "T"}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
                <div className="text-muted-foreground">Token Name:</div>
                <div className="font-medium text-right">{formData.name}</div>

                <div className="text-muted-foreground">Ticker:</div>
                <div className="font-medium text-right">{formData.ticker}</div>

                <div className="text-muted-foreground">Total Supply:</div>
                <div className="font-medium text-right">1,000,000,000</div>

                <div className="text-muted-foreground">Initial Buy:</div>
                <div className="font-medium text-right">{formData.initialBuyAmount} EDU</div>

                <div className="text-muted-foreground">Token Amount:</div>
                <div className="font-medium text-right">
                  {formData.initialTokens.toLocaleString()} {formData.ticker}
                </div>
              </div>
            </div>

            <div className="border border-input rounded-lg p-4 space-y-2 text-sm sm:text-base">
              <p className="text-muted-foreground">
                Launch cost: 0.1 EDU (liquidity) + 0.25 EDU (gas)
              </p>
              <p className="text-muted-foreground">Token supply: 1,000,000,000 tokens (fixed)</p>
              <p className="text-muted-foreground">
                You receive 2% of total supply (20,000,000 tokens)
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                • 25% unlocked when market cap reaches $1,000,000
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                • 25% unlocked when market cap reaches $3,000,000
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                • 25% unlocked when market cap reaches $6,000,000
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                • 25% unlocked when market cap reaches $10,000,000
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={onClose}
                className="w-full py-3 border border-input rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`cursor-pointer w-full py-3 bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black font-medium rounded-lg transition-colors flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Approve & Launch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
