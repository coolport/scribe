import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import styles from './styles/Home.module.css'
import extractYouTubeDetails from './utils/extract-id';
import { useNavigate } from 'react-router';

function Landing() {
  const [url, setUrl] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  const handleSubmit = (): void => {
    const finalUrl = extractYouTubeDetails(formValue || '');
    console.log("Parsed URL: ", finalUrl);
    setUrl(finalUrl);
    setFormValue('');
    console.log("Submitted Form");
  }

  const handleKeyDown = (e): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className={styles.left}>

        <p>Enter YouTube Link</p>
        <form onKeyDown={handleKeyDown} >
          <input
            value={formValue ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              const inputValue = e.target.value;
              setFormValue(inputValue);
            }}
          />
        </form>
      </div>
    </>
  )
}

export default Landing;
