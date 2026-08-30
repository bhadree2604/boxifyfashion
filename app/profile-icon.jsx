'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useProfile } from './profile-provider';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function ProfileIcon() {
  const { name } = useProfile();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const allowedEmailsStr = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
        if (allowedEmailsStr) {
          const allowedEmails = allowedEmailsStr
            .split(',')
            .map(e => e.trim().toLowerCase())
            .filter(e => e.length > 0);
          setIsAdmin(allowedEmails.includes(currentUser.email?.toLowerCase() || ''));
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const letter = (name || 'G').trim().charAt(0).toUpperCase() || 'G';

  return (
    <Link href="/admin" passHref legacyBehavior>
      <a
        className="profile-icon"
        title={name ? `Profile: ${name}` : 'Profile: Guest'}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          background: isAdmin ? '#10b981' : '#f3f4f6',
          color: isAdmin ? 'white' : '#374151',
          borderRadius: '50%',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        {letter}
        {isAdmin && (
          <span style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 8,
            height: 8,
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid white',
          }}></span>
        )}
      </a>
    </Link>
  );
}
