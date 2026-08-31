'use client';

import { useCustomerAuth } from './customer-auth-provider';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeaderAuth() {
  const { customer, customerProfile, loading, signOut } = useCustomerAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  if (loading) {
    return <div style={{ height: '36px', width: '36px' }} aria-hidden="true" />;
  }

  if (!customer) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link href="/signup" className="btn btn-sm" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
          Get Started
        </Link>
        <Link href="/signin" className="btn btn-sm" style={{ background: 'var(--muted)', color: 'white', border: 'none', padding: '0.35rem 0.75rem', fontSize: '0.75rem', opacity: 0.8 }}>
          Sign In
        </Link>
      </div>
    );
  }

  const handleLogoClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (path) => {
    setDropdownOpen(false);
    if (path === '/account') {
      router.push('/account');
    } else if (path === 'logout') {
      signOut();
      router.push('/');
    }
  };

  const getInitial = () => {
    const name = customerProfile?.name || customer?.email || 'U';
    return name.toString().charAt(0).toUpperCase();
  };

  return (
    <div className="dropdown-wrapper" ref={dropdownRef} onClick={handleLogoClick}>
      <div className="avatar-header" aria-label="Account menu">
        {getInitial()}
      </div>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <Link
            href="/account"
            onClick={(e) => { e.stopPropagation(); handleSelect('/account'); }}
            className="dropdown-link"
          >
            Profile
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); handleSelect('logout'); }}
            className="dropdown-item"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}