'use client';

export default function SplashProvider({ children }) {
  // Disabled splash to avoid stuck loader; renders children directly.
  return <>{children}</>;
}
