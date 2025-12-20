import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";
import extractYouTubeDetails from "./utils/extract-id";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";

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
      navigate(`/${url}`);
    }
  }, [navigate, url]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative h-screen bg-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [&>div]:bg-[size:14px_24px] [&>div]:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center">
        <div className="flex-1 flex flex-col justify-end">
          <div className="text-center mb-16">
            <h1 className="text-9xl font-bold text-white font-serif">Scribe</h1>
            <p className="mt-4 text-xl text-slate-300 font-sans">
              Timestamped notes for YouTube
            </p>
          </div>
        </div>
        <div className="w-full max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              className="w-full bg-transparent text-center text-white text-2xl px-6 py-6 border-0 border-b-2 border-slate-700 focus-visible:ring-0 focus:outline-none focus:bg-transparent transition-colors shadow-none placeholder:text-slate-600"
              placeholder="Enter YouTube Link"
              value={formValue ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const inputValue = e.target.value;
                setFormValue(inputValue);
              }}
              onKeyDown={handleKeyDown}
            />
          </form>
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
}

export default Landing;
