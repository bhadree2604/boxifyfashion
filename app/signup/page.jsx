'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create profile doc with minimal info and profileComplete false
      await setDoc(doc(db, 'customers', user.uid), {
        name,
        email,
        createdAt: new Date(),
        profileComplete: false,
      });
      // Update auth displayName
      await user.updateProfile({
        displayName: name,
      });
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setGoogleError('');
    if (!isFirebaseConfigured || !auth) {
      setGoogleError('Firebase credentials are not set in .env.local!');
      return;
    }
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if customer profile exists
      const customerRef = doc(db, 'customers', user.uid);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists()) {
        // Create new customer profile
        await setDoc(customerRef, {
          name: user.displayName || '',
          email: user.email,
          createdAt: new Date(),
          profileComplete: false,
        });
      }
      // Let customer-auth-provider handle redirect to /complete-profile if needed
      router.push('/');
    } catch (err) {
      console.error('Google sign-in failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setGoogleError('Sign-in cancelled.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setGoogleError('An account already exists with this email. Please sign in with email/password instead.');
      } else {
        setGoogleError(`Sign-in failed: ${err.message}`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
    }}>
      {/* Split layout: left form, right visual */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px',
        padding: '2rem',
      }}>
        {/* Left: Form */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'white',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          maxWidth: '420px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Image src="/logo-2026.png" alt="Boxify Fashion" width={120} height={72} style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Get Started</h2>
            <p className="muted">
              Create your account to save preferences and checkout faster.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {error && <div className="admin-error-banner">{error}</div>}
            <label className="admin-form-group">
              <span>Name</span>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="admin-form-group">
              <span>Email</span>
              <input
                type="email"
                required
                className="admin-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="admin-form-group">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={6}
                className="admin-input"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="btn solid" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Google Sign-In Divider and Button */}
          <div style={{ textAlign: 'center', margin: '1.25rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            — or —
          </div>

          {googleError && <div className="admin-error-banner" style={{ marginBottom: '0.75rem' }}>{googleError}</div>}
          <button
            className="btn outline"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{ width: '100%' }}
          >
            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
          </button>

          <div className="text-center text-sm" style={{ marginTop: '1.25rem' }}>
            <p>
              Already have an account?{' '}
              <Link href="/signin" className="link">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Visual panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #2c5aa0, #1a3a52)',
          borderRadius: '16px',
          color: 'white',
          minHeight: '400px',
        }}>
          {/* Use an image from /images if available, else fallback to gradient */}
          <div style={{
            width: '100%',
            maxWidth: '300px',
            height: '200px',
            backgroundImage: 'url(/images/boxify-team.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            marginBottom: '1.5rem',
          }}></div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Join the Boxify Fashion Community</h3>
          <p className="muted" style={{ opacity: 0.9 }}>
            Get exclusive updates, early access to new collections, and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}