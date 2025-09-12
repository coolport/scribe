import { useState, type ChangeEvent, type KeyboardEvent, useEffect } from 'react';
import styles from './styles/Home.module.css'
import extractYouTubeDetails from './utils/extract-id';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';

function Landing() {
  const [url, setUrl] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  // const playerRef = useRef<any>(null);

  const navigate = useNavigate();

  const handleSubmit = (): void => {
    const finalUrl = extractYouTubeDetails(formValue || '');
    console.log("Parsed URL: ", finalUrl);
    setUrl(finalUrl);
  }

  // Better handling
  useEffect(() => {
    if (url) {
      navigate("/home", {
        state: { url }
      })
    }
  }, [navigate, url])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter pressed.")
      handleSubmit();
    }
  };

  return (
    <>
      <div className={styles.left}>

        <p className='align-middle'>Enter YouTube Link</p>
        <form >
          <Input
            className="rounded-full"
            value={formValue ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              const inputValue = e.target.value;
              setFormValue(inputValue);
              console.log(inputValue)
            }}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </>
  )
}

export default Landing;
