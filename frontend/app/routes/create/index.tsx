// app/routes/create/index.tsx
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { ScrambleText } from "@fund/scramble-text";
import { toast } from "sonner";
import { ImageUploader } from "./comp/image-uploader";
import { ConfirmLaunchModal } from "./comp/modal";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { decodeEventLog, parseEther } from "viem";
import { useNavigate } from "react-router";
import { useFundWallet } from "@fund/wallet/provider";

export function meta() {
  const title = "Create a Token | GoFundingDotFun";
  const description =
    "Launch your own funding token in minutes on Solana. Customize token name, ticker, image, and description. Empower decentralized fundraising for your project, startup, or research.";
  const image = "/logo.png";
  const url = "https://fundgoal.fun/create";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: "@gofundingdotfun" },
    { name: "theme-color", content: "#3F5F15" },
  ];
}

export default function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    donationAddress: "",
    initialTokens: 1_000_000_000,
    embedCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { isConnected } = useFundWallet();

  const {
    writeContract: createToken,
    data: hashCreateToken,
    isPending: loadingCreateToken,
  } = useWriteContract();

  const { data: createTokenReceipt, isLoading: loadingCreateTokenReceipt } =
    useWaitForTransactionReceipt({
      hash: hashCreateToken,
    });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (agreedToTerms) setShowModal(true);
    else toast("Please agree to the terms and conditions.");
  };

  const confirmLaunch = async () => {
    setIsLoading(true);
    try {
      createToken({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "createToken",
        args: [formData.name, formData.ticker],
        value: parseEther("0.1"),
      });
    } catch (err) {
      console.error(err);
      toast("Failed to initiate token creation.");
    }
  };

  const saveToken = async ({
    bondingAddress,
    tokenAddress,
  }: {
    bondingAddress: string;
    tokenAddress: string;
  }) => {
    try {
      const payload = {
        name: formData.name,
        ticker: formData.ticker,
        description: formData.description,
        initialTokens: formData.initialTokens,
        contractAddress: tokenAddress,
        donationAddress: formData.donationAddress,
        embedCode: formData.embedCode,
        bondingCurveAddress: bondingAddress,
        status: "active",
      };

      const compiledFD = new FormData();
      if (image) compiledFD.append("image", image);
      compiledFD.append("payload", JSON.stringify(payload));

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/tokens`, {
        method: "POST",
        body: compiledFD,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create token");
      }

      setShowModal(false);
    } catch (error) {
      toast(`Error creating token: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (createTokenReceipt) {
      for (const log of createTokenReceipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: ABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "BondingCurveCreated") {
            const bondingAddress = decoded.args["bondingCurveAddress"];
            const tokenAddress = decoded.args["tokenAddress"];

            saveToken({ bondingAddress, tokenAddress });
            toast("Token created successfully! 🥳");

            setTimeout(() => {
              navigate(`/${tokenAddress}`, { replace: true, preventScrollReset: true });
            }, 3000);
          }
        } catch {
          // not our event, ignore
        }
      }
    }
  }, [createTokenReceipt]);

  if (!isConnected) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-lg sm:text-xl text-gray-500 mb-8">
          Please connect your wallet to create your token on FundGoalDotFun.
        </p>
        <p className="text-md text-gray-400">Make sure your wallet is connected.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen mx-auto py-6 px-4 sm:px-6 lg:px-8 xl:max-w-6xl mb-28">
        <p className="text-3xl sm:text-5xl lg:text-8xl my-12 lg:my-24 text-center">
          <ScrambleText title="Launch your token" />
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <label className="block text-lg sm:text-xl mb-2">Name</label>
              <input
                name="name"
                placeholder='Example: "Genova"'
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-input rounded-lg bg-background"
                required
              />
              <label className="block text-lg sm:text-xl mb-2">Ticker</label>
              <input
                name="ticker"
                placeholder='Example: "$GEN"'
                value={formData.ticker}
                onChange={handleChange}
                className="w-full p-3 border border-input rounded-lg bg-background"
                required
              />
              <label className="block text-lg sm:text-xl mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Explain your project"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-input rounded-lg bg-background min-h-[120px]"
                required
              />
              <label className="block text-lg sm:text-xl mb-2">EVM Donation Address (optional)</label>
              <input
                name="donationAddress"
                placeholder="0x...."
                value={formData.donationAddress}
                onChange={handleChange}
                className="w-full p-3 border border-input rounded-lg bg-background"
              />
            </div>

            <div className="space-y-6">
              <label className="block text-lg sm:text-xl mb-2">Upload a Picture</label>
              <ImageUploader onChange={(file) => setImage(file)} />
              <label className="block text-lg sm:text-xl mb-2">Embed Code</label>
              <textarea
                name="embedCode"
                placeholder="Embed code, YouTube or LinkedIn"
                value={formData.embedCode}
                onChange={handleChange}
                className="w-full p-3 border border-input rounded-lg bg-background min-h-[120px]"
                rows={6}
                required
              />
            </div>
          </div>

          <div className="border border-input rounded-lg bg-background p-4">
            <label className="flex items-start cursor-pointer text-sm space-x-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms((prev) => !prev)}
                className="mt-1"
              />
              <span>I agree to the Terms and Conditions</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              {isLoading ? "Processing..." : "Launch Token"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmLaunchModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmLaunch}
      />
    </>
  );
}