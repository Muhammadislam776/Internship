import React from 'react';
import { ProfileCard } from '../components/ProfileCard';
import { FlipProfileCard } from '../components/FlipProfileCard';
import { MediaGallery } from '../components/MediaGallery';
import { ProfileCompletion } from '../components/ProfileCompletion';
import { SecurityCard } from '../components/SecurityCard';
import { ProfilePreviewModal } from '../components/ProfilePreviewModal';

export const Profile = ({
  profile,
  onOpenUpload,
  onOpenEdit,
  onConfirmDelete
}) => {
  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Grid Layout: Desktop 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ProfileCard
            profile={profile}
            onOpenUpload={onOpenUpload}
            onOpenEdit={onOpenEdit}
            onConfirmDelete={onConfirmDelete}
          />

          <ProfileCompletion
            profile={profile}
            onCompleteAction={(action) => {
              if (action === 'upload') onOpenUpload();
              else onOpenEdit();
            }}
          />

          <SecurityCard />
        </div>

        {/* Right Secondary Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <FlipProfileCard profile={profile} />

          <ProfilePreviewModal profile={profile} />

          <MediaGallery
            uploads={profile?.previousUploads || []}
            currentAvatar={profile?.avatar_url}
          />
        </div>
      </div>
    </div>
  );
};
