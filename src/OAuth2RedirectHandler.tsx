import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    console.log('OAuth2RedirectHandler mounted');
    console.log('Current location:', location.pathname + location.search);
    
    // Prevent double processing
    if (hasProcessed.current) {
      console.log('Already processed, skipping');
      return;
    }
    hasProcessed.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    console.log('Token from URL:', token ? token.substring(0, 20) + '...' : 'null');

    if (token) {
      console.log('Token found, logging in...');
      login(token);
      console.log('Navigating to home page');
      navigate('/', { replace: true });
    } else {
      console.error('No token found in redirect URL');
      navigate('/', { replace: true });
    }
  }, [location, navigate, login]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>Processing authentication...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
