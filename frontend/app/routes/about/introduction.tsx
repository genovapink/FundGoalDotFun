import { motion } from "framer-motion";

export function Introduction() {
  return (
    <motion.div
      className="mb-20 px-4 sm:px-6"
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
        FundFun makes crypto trading and token funding <strong>simple, fast, and accessible</strong>
        . Whether you're exploring active markets or launching your own funding token, our platform
        ensures a seamless experience with just a few clicks.
      </motion.p>

      <motion.p
        className="mt-4 text-lg sm:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Designed for efficiency, FundFun empowers users to create tokens, trade effortlessly, and
        track market growth—all while maintaining full transparency and security.
      </motion.p>

      <motion.p
        className="mt-6 text-lg sm:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Start your journey with FundFun today and turn your crypto ideas into reality!
      </motion.p>
    </motion.div>
  );
}
