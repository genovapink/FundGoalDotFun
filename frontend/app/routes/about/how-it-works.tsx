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
        GoFundingDotFun is your gateway to effortless crypto funding. Whether you're a creator
        looking to launch a token or an investor exploring exciting opportunities, GoFundingDotFun
        makes it simple to connect, trade, and grow.
      </motion.p>

      <motion.ol
        className="list-decimal list-inside space-y-2 text-base sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <li>Pick a coin that you like from the Funding Market.</li>
        <li>Buy the coin by connecting your wallet.</li>
        <li>Sell the coin at any time to lock in your profits or losses.</li>
      </motion.ol>

      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        With GoFundingDotFun, you can also create your own funding token in just a few steps:
      </motion.p>

      <motion.ol
        className="list-decimal list-inside space-y-2 text-base sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <li>Fill out a simple form with details like the token name, ticker, and description.</li>
        <li>Upload a profile image and provide optional social media or website links.</li>
        <li>Connect your wallet and confirm the deployment of your token.</li>
        <li>Your token goes live in the marketplace, ready for trading!</li>
      </motion.ol>

      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        GoFundingDotFun ensures a <strong>fair-launch</strong> system where all tokens are created
        with transparency, giving everyone equal access to buy and sell. As the market grows,
        creators can earn rewards while traders enjoy a secure and seamless experience.
      </motion.p>

      <motion.p
        className="text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Start your journey with GoFundingDotFun and bring your crypto ideas to life!
      </motion.p>
    </motion.div>
  );
}
