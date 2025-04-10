import { motion } from "motion/react";

export function Introduction() {
  return (
    <motion.div
      className="mb-32 px-4 sm:px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="text-lg sm:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <strong>GoFundingDotFun</strong> is a decentralized launchpad designed to fund the future of
        learning, discovery, and innovation. Built on <strong>EduChain</strong>, it enables anyone
        to launch fundraising tokens for scholarships, scientific research, creative projects, and
        early-stage startups—with no gatekeepers, no friction, and full transparency.
      </motion.p>

      <motion.p
        className="mt-4 text-lg sm:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        From student-led experiments to decentralized science (DeSci) and open-source ventures,
        GoFundingDotFun makes it radically simple to bootstrap public-good projects with onchain
        tokenization, gamified milestones, and programmable incentives.{" "}
        <strong>Donations flow peer-to-peer, tracked transparently on the blockchain</strong>.
      </motion.p>

      <motion.p
        className="mt-6 text-lg sm:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Whether you're a researcher, a student, a builder, or a believer in decentralized change,
        GoFundingDotFun gives you the tools to turn your vision into reality—one token at a time.
      </motion.p>
    </motion.div>
  );
}
