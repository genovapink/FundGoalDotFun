import type React from "react";
import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Upload, Globe, Twitter, Send, X, Check, AlertCircle } from "lucide-react";
import { DynamicHeader } from "@fund/dynamic-header";
import { ScrambleText } from "@fund/scramble-text";
import { toast } from "sonner";
import { ImageUploader } from "./comp/image-uploader";
import { ConfirmLaunchModal } from "./comp/modal";

export function meta() {
  return [
    { title: "Create - Gofunding" },
    { name: "description", content: "Create - Gofunding" },
    { name: "image", content: "/logo.png" },
    { name: "og:image", content: "/logo.png" },
    { name: "twitter:image", content: "/logo.png" },
  ];
}

export default function Create() {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    donationAddress: "",
    initialBuyAmount: "1000",
    initialTokens: 42000000,
    embedCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (agreedToTerms) setShowModal(true);
  };

  const confirmLaunch = async () => {
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        ticker: formData.ticker,
        description: formData.description,
        initialBuyPerToken: Number(formData.initialBuyAmount),
        marketCap: 5_000, // WIP
        contractAddress: "", // WIP
        donationAddress: formData.donationAddress,
        embedCode: formData.embedCode, // added
        bondingCurveAddress: "", // WIP
        status: "active",
      };

      toast(`Submitting payload...`);

      const compiledFD = new FormData();
      compiledFD.append("image", image!); // file from input
      compiledFD.append("payload", JSON.stringify(payload));

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/tokens`, {
        method: "POST",
        body: compiledFD,
        // body: JSON.stringify({
        //   image:
        //   data: JSON.stringify(payload),
        // }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create token");
      }

      toast(`Token created successfully! 🥳`);

      setShowModal(false);
    } catch (error) {
      toast(`Error creating token: ${error}`);
    } finally {
      setIsLoading(false);
    }
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
                <label className="block text-lg sm:text-xl mb-2">Name</label>
                <input
                  name="name"
                  placeholder='Example: "Eliska"'
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">Ticker</label>
                <input
                  name="ticker"
                  placeholder='Example: "$ELISK"'
                  value={formData.ticker}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Explain your project"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">Donation Address (optional)</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      name="donationAddress"
                      placeholder="0x...."
                      value={formData.donationAddress}
                      onChange={handleChange}
                      className="w-full p-3 border border-input rounded-lg bg-background text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">
                  Initial Buy / Get Token (optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
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
                <label className="block text-lg sm:text-xl mb-2">Upload a Picture</label>
                <ImageUploader onChange={(file) => setImage(file)} />
              </div>

              <div>
                <label className="block text-lg sm:text-xl mb-2">Embed Code</label>
                <textarea
                  name="embedCode"
                  placeholder="Embed code, youtube or linkedin"
                  value={formData.embedCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-input rounded-lg bg-background min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  rows={12}
                  required
                />
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
            className={`cursor-pointer w-full py-3 sm:py-4 font-medium rounded-lg transition-colors ${
              agreedToTerms
                ? "bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Launch
          </button>
        </form>

        {showModal && (
          <ConfirmLaunchModal
            onClose={() => setShowModal(false)}
            onConfirm={confirmLaunch}
            isLoading={isLoading}
            formData={formData}
            image={image}
          />
        )}
      </div>
    </>
  );
}
