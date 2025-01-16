import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { EngineerMessages } from "@/components/AICivilEngineer/EngineerMessages";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Hero />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <EngineerMessages />
      </motion.div>
      <Features />
    </div>
  );
}