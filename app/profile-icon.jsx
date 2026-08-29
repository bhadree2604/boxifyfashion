'use client';
import { useProfile } from './profile-provider';

export default function ProfileIcon() {
  const { name } = useProfile();
  const letter = (name || 'G').trim().charAt(0).toUpperCase() || 'G';
  return (
    <div className="profile-icon" title={name ? `Profile: ${name}` : 'Profile: Guest'}>
      {letter}
    </div>
  );
}
