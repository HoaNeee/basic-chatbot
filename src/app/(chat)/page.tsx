"use client";

import { useChat } from "@/context/ChatContext";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const HomePage = () => {
  const { clearChat } = useChat();

  useEffect(() => {
    clearChat();
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden overflow-y-auto">
      <div className="w-full h-full max-w-3xl p-4 mx-auto">
        <AnimatePresence mode="wait">
          <div className="flex flex-col items-start justify-center h-full gap-1 -mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className=""
            >
              <h2 className="text-3xl font-semibold">Hello there!</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className=""
            >
              <h4 className="dark:text-white/80 text-xl text-gray-500">
                How can I assist you today?
              </h4>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
