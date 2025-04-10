import { motion } from "motion/react";

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
    <div className="space-y-12 mb-32 px-4 sm:px-6">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col gap-4 sm:gap-6 ${
            index % 2 === 1 ? "sm:text-end" : "sm:text-start"
          }`}
        >
          <motion.p
            className="text-xl sm:text-2xl font-bold underline underline-offset-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            {section.title}
          </motion.p>
          <motion.p
            className="text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 + 0.1 }}
          >
            {section.content}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
