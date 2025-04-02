import type React from "react";
import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Upload, Globe, Twitter, Send, X, Check, AlertCircle } from "lucide-react";
import { DynamicHeader } from "@fund/dynamic-header";
import { ScrambleText } from "@fund/scramble-text";

export default function Create() {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    initialBuyAmount: "1000",
    initialTokens: 42000000,
    website: "",
    twitter: "",
    telegram: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (agreedToTerms) setShowModal(true);
  };

  const confirmLaunch = () => {
    console.log({ ...formData, image });
    setShowModal(false);
  };

  return (
    <>
      <DynamicHeader title="Create" />
      <div className="w-full min-h-screen mx-auto py-6 px-4 sm:px-6 lg:px-8 xl:max-w-6xl mb-20">
        <p className="text-3xl sm:text-5xl lg:text-8xl my-12 lg:my-24 text-center">
          <ScrambleText title="Launch your token" />
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg sm:text-xl mb-2">
                  Funding Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder='Example: "Eliska"'
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="ticker" className="block text-lg sm:text-xl mb-2">
                  Ticker
                </label>
                <input
                  type="text"
                  id="ticker"
                  name="ticker"
                  placeholder='Example: "$ELISK"'
                  value={formData.ticker}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-lg sm:text-xl mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Explain your project"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">
                  Initial Buy / Get Token (optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="initialBuyAmount"
                      placeholder="1000"
                      value={formData.initialBuyAmount}
                      onChange={(e) => {
                        const amount = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          initialBuyAmount: amount,
                          initialTokens: amount ? Number(amount) * 42000 : 0,
                        }));
                      }}
                      className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <div className="h-full flex items-center justify-center px-3 bg-secondary text-secondary-foreground rounded-r-lg border-l border-input text-sm">
                        EDU
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={formData.initialTokens ? formData.initialTokens.toLocaleString() : "0"}
                      className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg sm:text-xl mb-2">Upload Profile Image</label>
                <div
                  className="border border-input rounded-lg bg-background p-4 flex items-center justify-center cursor-pointer h-[180px] sm:h-[200px]"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Token logo preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                      />
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                        Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="border border-dashed border-input rounded-lg p-4 sm:p-6">
                        <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
                        Drag & drop or click to upload (max 1 MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">Social Links (optional)</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="url"
                      name="website"
                      placeholder="Website URL"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      name="twitter"
                      placeholder="Twitter handle"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      name="telegram"
                      placeholder="Telegram handle"
                      value={formData.telegram}
                      onChange={handleChange}
                      className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-input rounded-lg bg-background p-4">
            <label className="flex items-start cursor-pointer text-sm sm:text-base">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 mr-2 sm:mr-3 flex-shrink-0"
                required
              />
              <span>
                I agree that I am creating a funding token with a fixed supply of 1,000,000,000
                tokens. I understand that as the deployer, I will receive 2% of the total supply
                with vesting conditions (50% unlocked at $1M market cap, 50% at $3M market cap). I
                confirm that I have reviewed all information and am ready to deploy this token to
                the market.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreedToTerms}
            className={`w-full py-3 sm:py-4 font-medium rounded-lg transition-colors ${
              agreedToTerms
                ? "bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Launch
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Confirm Token Launch</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
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
                      {preview ? (
                        <img
                          src={preview || "/placeholder.svg"}
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
                      Launch cost: 0.5 EDU (liquidity) + 0.25 EDU (gas)
                    </p>
                    <p className="text-muted-foreground">
                      Token supply: 1,000,000,000 tokens (fixed)
                    </p>
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
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full py-3 border border-input rounded-lg hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmLaunch}
                      className="w-full py-3 bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirm & Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
