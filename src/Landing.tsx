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
    <div className="relative h-screen bg-slate-950 overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [&>div]:bg-[size:14px_24px] [&>div]:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl"
        >
          <AppHeader title="Scribe - Paste, Play, Annotate" />
        </motion.div>
        <div className="flex h-full flex-col items-center px-4">
        <div className="flex-[1] flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-7 text-center"
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
              transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-2xl text-slate-400 font-sans tracking-[0.2em] uppercase font-light"
            >
              The Modern Annotator
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 w-full max-w-2xl px-6 md:px-0"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl transition-colors duration-300 focus-within:border-white/15"
          >
            <Input
              className="relative z-10 h-15 w-full rounded-[22px] border border-white/6 bg-black/5 px-6 text-center text-base text-white shadow-none transition-all duration-300 placeholder:text-slate-600 focus-visible:border-white/10 focus-visible:ring-0 focus:outline-none md:h-[68px] md:px-8 md:text-lg"
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
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">
            Supports Videos, Shorts, and direct share links
          </p>
        </motion.div>

        <div className="flex-1" />

        {/* Proper Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
