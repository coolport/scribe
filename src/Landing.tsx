import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";
import extractYouTubeDetails from "./utils/extract-id";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

function Landing() {
  const [url, setUrl] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (): void => {
    const finalUrl = extractYouTubeDetails(formValue || "");
    console.log("Parsed URL: ", finalUrl);
    setUrl(finalUrl);
  };

  useEffect(() => {
    if (url) {
      navigate(`/video/${url}`);
    }
  }, [navigate, url]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative h-screen bg-slate-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [&>div]:bg-[size:14px_24px] [&>div]:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-4">
        <div className="flex-1 flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a more "premium" feel
            }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-8xl md:text-9xl font-bold text-white font-serif tracking-tight"
            >
              Scribe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-6 text-base md:text-xl text-slate-400 font-sans tracking-wide"
            >
              Timestamped notes for YouTube
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full max-w-xl px-6 md:px-0 mb-12"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="group"
          >
            <Input
              className="w-full bg-transparent text-center text-white text-sm md:text-2xl px-6 py-6 border-0 border-b-2 border-slate-700/50 focus:border-slate-400 transition-all duration-500 ease-out focus-visible:ring-0 focus:outline-none shadow-none placeholder:text-slate-600 focus:placeholder:text-slate-700"
              placeholder="Enter YouTube Link"
              value={formValue ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const inputValue = e.target.value;
                setFormValue(inputValue);
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="h-[2px] w-0 bg-white mx-auto transition-all duration-700 ease-out group-focus-within:w-full" />
          </form>
        </motion.div>

        <div className="flex-1" />

        {/* Subtle footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
          className="pb-8 text-xs text-slate-500 tracking-widest uppercase"
        >
          Built for learners
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;
