import { motion } from "motion/react";

export function HowTo() {
  const sections = [
    {
      title: "Get Started Instantly",
      content:
        "Dive into the Funding Market to discover active campaigns or launch your own tokenized project. With just a wallet and a few clicks, you're ready to fund what matters.",
    },
    {
      title: "Launch Your Funding Token",
      content:
        "Customize your token with a name, ticker, and description. Upload a logo, plug in your socials, and launch your ERC-20 on EduChain—fully onchain, no code required.",
    },
    {
      title: "Trade and Support Projects",
      content:
        "Explore live tokens, connect your wallet, and start trading. Support research, creators, or early-stage builders while earning or contributing—transparently and securely.",
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
