import { useState, type ChangeEvent, type KeyboardEvent, useEffect } from 'react';
import extractYouTubeDetails from './utils/extract-id';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';

function Landing() {
  const [url, setUrl] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (): void => {
    const finalUrl = extractYouTubeDetails(formValue || '');
    console.log("Parsed URL: ", finalUrl);
    setUrl(finalUrl);
  }

  useEffect(() => {
    if (url) {
      navigate(`/${url}`)
    }
  }, [navigate, url])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">Scribe</h1>
        <p className="mt-2 text-lg text-gray-600">Your YouTube Note-Taker</p>
      </div>
      <div className="w-full max-w-md mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            className="w-full px-4 py-3 text-lg text-center text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your YouTube link here"
            value={formValue ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              const inputValue = e.target.value;
              setFormValue(inputValue);
            }}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  )
}

export default Landing;
