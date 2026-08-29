'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('boxify-profile-name');
    if (saved) setName(saved);
    setReady(true);
  }, []);

  const saveName = (val) => {
    setName(val);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('boxify-profile-name', val);
    }
  };

  return (
    <ProfileContext.Provider value={{ name, setName: saveName, ready }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
