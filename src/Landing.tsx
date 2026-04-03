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
import { Github, Globe, Shield } from "lucide-react";

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
    <div className="relative h-screen bg-slate-950 overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [&>div]:bg-[size:14px_24px] [&>div]:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-4">
        <div className="flex-[1.5] flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[10rem] md:text-[14rem] font-bold text-white font-serif tracking-tighter leading-[0.8] mb-4 select-none"
            >
              Scribe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="text-lg md:text-2xl text-slate-400 font-sans tracking-[0.2em] uppercase font-light"
            >
              The Modern Annotator
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="w-full max-w-2xl px-6 md:px-0 mb-20"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="group relative"
          >
            <Input
              className="w-full bg-transparent text-center text-white text-base md:text-lg px-8 py-8 border-0 border-b-2 border-slate-700/50 focus:border-slate-400 transition-all duration-700 ease-out focus-visible:ring-0 focus:outline-none shadow-none placeholder:text-slate-700 focus:placeholder:text-slate-800"
              placeholder="Paste your YouTube link here"
              value={formValue ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const inputValue = e.target.value;
                setFormValue(inputValue);
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-1000 ease-out group-focus-within:w-full" />
          </form>
          <p className="mt-4 text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">
            Supports Videos & Shorts
          </p>
        </motion.div>

        <div className="flex-1" />

        {/* Proper Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          className="w-full max-w-6xl pb-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center space-x-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>MIT License</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-3 w-3" />
              <span>Open Source</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-600 font-bold tracking-[0.4em] uppercase">
            © 2026 Scribe Precision / v1.0.4
          </div>

          <div className="flex items-center space-x-6">
            <a 
              href="#" 
              className="text-slate-500 hover:text-white transition-colors duration-300"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default Landing;
