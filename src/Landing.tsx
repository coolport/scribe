import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";
import extractYouTubeDetails from "./utils/extract-id";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Github, Globe, Shield } from "lucide-react";
import AppHeader from "./AppHeader";

function Landing() {
  const defaultTitle = "Scribe | Home";
  const [url, setUrl] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (): void => {
    const finalUrl = extractYouTubeDetails(formValue || "");
    console.log("Parsed URL: ", finalUrl);
    setUrl(finalUrl);
  };

  useEffect(() => {
    document.title = defaultTitle;
  }, [defaultTitle]);

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
    <div className="relative min-h-screen bg-slate-950 overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [&>div]:bg-[size:14px_24px] [&>div]:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl"
        >
          <AppHeader title="Scribe - Paste, Play, Annotate" />
        </motion.div>
        <div className="flex min-h-0 flex-1 flex-col items-center px-4">
        <div className="flex-[0.82] flex flex-col justify-end pt-2 md:flex-[1] md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-5 text-center md:mb-7"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-3 select-none font-serif text-[4.75rem] font-bold leading-[0.84] tracking-tighter text-white sm:text-[6.5rem] md:mb-4 md:text-[14rem]"
            >
              Scribe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-light uppercase tracking-[0.16em] text-slate-400 sm:text-base md:text-2xl md:tracking-[0.2em]"
            >
              The Modern Annotator
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 w-full max-w-2xl px-2 sm:px-4 md:mb-12 md:px-0"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl transition-colors duration-300 focus-within:border-white/15"
          >
            <Input
              className="relative z-10 h-14 w-full rounded-[22px] border border-white/6 bg-black/5 px-4 text-center text-[15px] text-white shadow-none transition-all duration-300 placeholder:text-slate-600 focus-visible:border-white/10 focus-visible:ring-0 focus:outline-none sm:px-6 md:h-[68px] md:px-8 md:text-lg"
              placeholder="Paste your YouTube link here"
              value={formValue ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const inputValue = e.target.value;
                setFormValue(inputValue);
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="pointer-events-none absolute inset-x-12 bottom-1.5 h-px scale-x-0 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-700 ease-out group-focus-within:scale-x-100 group-focus-within:opacity-100" />
          </form>
          <p className="mt-3 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600 md:mt-4 md:text-[10px] md:tracking-[0.24em]">
            Supports Videos, Shorts, and direct share links
          </p>
        </motion.div>

        <div className="flex-1" />

        {/* Proper Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl border-t border-slate-900 pb-8 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6 md:pb-12 md:pt-8"
        >
          <div className="flex items-center space-x-4 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 md:space-x-6 md:text-[10px] md:tracking-widest">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>MIT License</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-3 w-3" />
              <span>Open Source</span>
            </div>
          </div>

          <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-600 md:text-[10px] md:tracking-[0.4em]">
            © 2026 Scribe / v1.0.0
          </div>

          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/coolport/scribe" 
              className="text-slate-500 hover:text-white transition-colors duration-300"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </motion.footer>
        </div>
      </div>
    </div>
  );
}

export default Landing;
