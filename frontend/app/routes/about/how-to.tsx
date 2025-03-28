import { motion } from "framer-motion";

export function HowTo() {
  const sections = [
    {
      title: "How to Get Started",
      content:
        "Explore the Funding Market to find tokens or create your own funding token in just a few simple steps. Connect your wallet, trade tokens, and grow your crypto portfolio.",
    },
    {
      title: "Creating Your Own Token",
      content:
        "Fill out a quick form with details like token name, ticker, and description. Upload a logo, optionally add social media links, and deploy your token seamlessly to the marketplace.",
    },
    {
      title: "Trading Tokens",
      content:
        "Pick a token from the Funding Market, connect your wallet, and start buying or selling. Lock in your profits or minimize your losses with transparent, on-chain transactions.",
    },
  ];

  return (
    <div className="space-y-12 mb-20">
      {sections.map((section, index) => (
        <div key={index} className={`flex flex-col gap-2 ${index % 2 === 1 ? "text-end" : ""}`}>
          <motion.p
            className="text-2xl font-bold underline underline-offset-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.2 }}
          >
            {section.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.2 + 0.1 }}
          >
            {section.content}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
