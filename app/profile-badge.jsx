'use client';
import { useProfile } from './profile-provider';

export default function ProfileBadge() {
  const { name } = useProfile();
  return (
    <div className="profile-tag" title="Profile name">
      {name ? `Profile: ${name}` : 'Profile: Guest'}
    </div>
  );
}
