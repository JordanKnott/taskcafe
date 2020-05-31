import React from 'react';

import {
  Profile,
  ProfileIcon,
  ProfileInfo,
  InfoTitle,
  InfoUsername,
  InfoBio,
  MiniProfileActions,
  MiniProfileActionWrapper,
  MiniProfileActionItem,
} from './Styles';

type MiniProfileProps = {
  displayName: string;
  username: string;
  bio: string;
  profileIcon: ProfileIcon | null;
  onRemoveFromTask: () => void;
};
const MiniProfile: React.FC<MiniProfileProps> = ({ displayName, username, bio, profileIcon, onRemoveFromTask }) => {
  return (
    <>
      <Profile>
        {profileIcon && <ProfileIcon bgColor={profileIcon.bgColor ?? ''}>{profileIcon.initials}</ProfileIcon>}
        <ProfileInfo>
          <InfoTitle>{displayName}</InfoTitle>
          <InfoUsername>{username}</InfoUsername>
          <InfoBio>{bio}</InfoBio>
        </ProfileInfo>
      </Profile>
      <MiniProfileActions>
        <MiniProfileActionWrapper>
          <MiniProfileActionItem
            onClick={() => {
              onRemoveFromTask();
            }}
          >
            Remove from card
          </MiniProfileActionItem>
        </MiniProfileActionWrapper>
      </MiniProfileActions>
    </>
  );
};

export default MiniProfile;
