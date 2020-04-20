import React from 'react';

import { Profile, ProfileIcon, ProfileInfo, InfoTitle, InfoUsername, InfoBio } from './Styles';

type MiniProfileProps = {
  displayName: string;
  username: string;
  bio: string;
  profileIcon: ProfileIcon;
};
const MiniProfile: React.FC<MiniProfileProps> = ({ displayName, username, bio, profileIcon }) => {
  return (
    <>
      <Profile>
        <ProfileIcon bgColor={profileIcon.bgColor ?? ''}>{profileIcon.initials}</ProfileIcon>
        <ProfileInfo>
          <InfoTitle>{displayName}</InfoTitle>
          <InfoUsername>{username}</InfoUsername>
          <InfoBio>{bio}</InfoBio>
        </ProfileInfo>
      </Profile>
    </>
  );
};

export default MiniProfile;
