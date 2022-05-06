import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './page/LoginPage';

const Login: React.FC = () => {
  const [settings, setSettings] = useState<null | { allowRegistration: string }>(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('/public_settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data.isInstalled) {
          navigate('/register');
        }
      });
  }, []);
  return (
    <LoginPage
      onLogin={(data, setError) => {
        console.log(data);
      }}
    />
  );
};

export default Login;
