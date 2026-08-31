'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isAdminEmail } from '@/lib/firebase';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Skip all customer profile logic for admin emails
        if (isAdminEmail(user.email)) {
          setCustomer(user);
          setCustomerProfile(null);
          setLoading(false);
          return;
        }

        setCustomer(user);
        // Fetch profile from Firestore
        const profileRef = doc(db, 'customers', user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setCustomerProfile(profileData);
          // Redirect to complete-profile if profile incomplete and not already there
          if (!profileData.profileComplete && pathname !== '/complete-profile') {
            router.push('/complete-profile');
          }
        } else {
          // If profile missing, create a basic one
          const initialData = {
            name: user.displayName || '',
            email: user.email,
            phone: user.phoneNumber || '',
            createdAt: new Date(),
            profileComplete: false,
          };
          setCustomerProfile(initialData);
          // Create doc in Firestore
          await setDoc(doc(db, 'customers', user.uid), initialData);
          // Redirect to complete-profile
          if (pathname !== '/complete-profile') {
            router.push('/complete-profile');
          }
        }
      } else {
        setCustomer(null);
        setCustomerProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const value = {
    customer,
    customerProfile,
    loading,
    signOut,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
