'use client';

import { useCustomerAuth } from '../../customer-auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountPage() {
  const { customer, customerProfile, loading, signOut } = useCustomerAuth();
  const router = useRouter();

  if (loading) {
    return <div className="account-page">Loading...</div>;
  }

  if (!customer) {
    router.push('/signin');
    return null;
  }

  // Format date
  const memberSince = customerProfile?.createdAt
    ? new Date(customerProfile.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const initial = (customerProfile?.name || customer.email || 'G')
    .toString()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="account-page">
      <div className="account-card">
        {/* Identity block */}
        <div className="identity-block">
          {/* Avatar - larger ~80px */}
          <div className="avatar-large">
            {initial}
          </div>
          <h2 className="identity-name">{customerProfile?.name || customer.email}</h2>
          <p className="identity-email">{customerProfile?.email}</p>
          {memberSince && (
            <p className="identity-member-since">Member since {memberSince}</p>
          )}
        </div>

        {/* Info tiles grid - 3 columns for 3 items, responsive to 2 on smaller screens */}
        <div className="info-tiles-grid">
          <div className="info-tile">
            <p className="info-tile-label">Phone</p>
            <p className="info-tile-value">{customerProfile?.phone || '—'}</p>
          </div>
          <div className="info-tile">
            <p className="info-tile-label">State</p>
            <p className="info-tile-value">{customerProfile?.state || '—'}</p>
          </div>
          <div className="info-tile">
            <p className="info-tile-label">District</p>
            <p className="info-tile-value">{customerProfile?.district || '—'}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <Link href="/complete-profile" className="btn outline" style={{ width: '100%', padding: '0.75rem 1rem' }}>
            Edit Profile
          </Link>
          <button
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
            className="btn"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              borderColor: 'transparent',
              color: 'white',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
            }}
          >
            Log Out
          </button>
        </div>

        <div className="account-footer-link">
          <Link href="/" className="link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}