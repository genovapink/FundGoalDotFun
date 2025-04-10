import { motion } from "motion/react";

export function HowItWorks() {
  return (
    <motion.div
      className="mb-32 px-4 sm:px-6 space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <strong>GoFundingDotFun</strong> is your decentralized gateway to launching and supporting
        onchain funding campaigns. Whether you're backing community-driven tokens or creating your
        own, the platform makes crypto-native fundraising simple, transparent, and fast.
      </motion.p>

      <motion.ol
        className="list-decimal list-inside space-y-2 text-base sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <li>Explore live tokens in the Funding Market—each tied to real goals or missions.</li>
        <li>Connect your wallet and buy tokens directly with full onchain transparency.</li>
        <li>Sell at any time or hold to support the project’s growth and milestones.</li>
      </motion.ol>

      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Want to launch your own funding token? It’s as easy as:
      </motion.p>

      <motion.ol
        className="list-decimal list-inside space-y-2 text-base sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <li>Fill out a quick form with your token’s name, ticker, and description.</li>
        <li>Add your logo and optional links (Twitter, website, GitHub, etc.).</li>
        <li>Connect your wallet and deploy your token—no coding needed.</li>
        <li>Your token is live on EduChain and ready for trading in seconds.</li>
      </motion.ol>

      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        All tokens follow a <strong>fair-launch</strong> model—no pre-mints, no hidden allocations.
        Every trade is onchain, every milestone is visible, and every creator earns transparently as
        their project grows.
      </motion.p>

      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Join the future of fundraising. Launch. Donate. Trade. Build—on GoFundingDotFun.
      </motion.p>
    </motion.div>
  );
}
