'use client';

import { useState, useEffect } from 'react';
import { useCustomerAuth } from '../customer-auth-provider';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import SearchableSelect from '../searchable-select';
import { statesAndDistricts } from '@/lib/india-states-districts';

export default function CompleteProfilePage() {
  const { customer, customerProfile, loading: authLoading } = useCustomerAuth();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load existing profile data to pre-fill form if available
  useEffect(() => {
    if (customerProfile) {
      setPhone(customerProfile.phone || '');
      setState(customerProfile.state || '');
      setDistrict(customerProfile.district || '');
    }
  }, [customerProfile]);

  // When state changes, reset district
  useEffect(() => {
    setDistrict('');
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!customer) throw new Error('User not authenticated');
      if (!state) {
        setError('Please select a state');
        return;
      }
      if (!district) {
        setError('Please select a district');
        return;
      }
      const docRef = doc(db, 'customers', customer.uid);
      await updateDoc(docRef, {
        phone,
        state,
        district,
        profileComplete: true,
      });
      // Optionally update auth displayName if name missing? but name already set.
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If user not authenticated, redirect to signin
  if (authLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }
  if (!customer) {
    router.push('/signin');
    return null;
  }

  const stateOptions = Object.keys(statesAndDistricts);
  const districtOptions = state ? statesAndDistricts[state] : [];

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
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Just a Few More Details</h2>
            <p className="muted">
              This helps us route your orders correctly and provide better service.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {error && <div className="admin-error-banner">{error}</div>}
            <label className="admin-form-group">
              <span>Phone Number</span>
              <input
                type="tel"
                required
                className="admin-input"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="admin-form-group">
              <span>State</span>
              <SearchableSelect
                options={stateOptions}
                value={state}
                onChange={setState}
                placeholder="Select your state"
                disabled={false}
              />
            </label>
            <label className="admin-form-group">
              <span>District</span>
              <SearchableSelect
                options={districtOptions}
                value={district}
                onChange={setDistrict}
                placeholder="Select your district"
                disabled={districtOptions.length === 0}
              />
            </label>
            <button className="btn solid" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Saving details...' : 'Save & Continue'}
            </button>
          </form>

          <div className="text-center text-sm" style={{ marginTop: '1rem' }}>
            <p>
              <Link href="/" className="link">
                ← Skip for now (you can complete this later in your account)
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
          <div style={{
            width: '100%',
            maxWidth: '300px',
            height: '200px',
            backgroundImage: 'url(/images/art-201.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            marginBottom: '1.5rem',
          }}></div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Complete Your Profile</h3>
          <p className="muted" style={{ opacity: 0.9 }}>
            Adding your phone, state, and district ensures accurate order processing and delivery estimates.
          </p>
        </div>
      </div>
    </div>
  );
}