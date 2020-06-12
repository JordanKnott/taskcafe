import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { User } from 'shared/icons';

const TextFieldWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  justify-content: center;

  margin-bottom: 2.2rem;
  margin-top: 17px;
`;

const TextFieldLabel = styled.span`
  padding: 0.7rem !important;
  color: #c2c6dc;
  left: 0;
  top: 0;
  transition: all 0.2s ease;
  position: absolute;
  border-radius: 5px;
  overflow: hidden;
  font-size: 0.85rem;
  cursor: text;
  width: 100%;
  font-size: 12px;
      user-select: none;
    pointer-events: none;
}
`;

const TextFieldInput = styled.input`
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #262c49;
  padding: 0.7rem !important;
  color: #c2c6dc;
  position: relative;
  border-radius: 5px;
  transition: all 0.3s ease;
  width: 100%;
  &:focus {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(115, 103, 240);
  }
  &:focus ~ ${TextFieldLabel} {
    color: rgba(115, 103, 240);
    transform: translate(-3px, -90%);
  }
`;

type TextFieldProps = {
  label: string;
};
const TextField: React.FC<TextFieldProps> = ({ label }) => {
  return (
    <TextFieldWrapper>
      <TextFieldInput />
      <TextFieldLabel>{label}</TextFieldLabel>
    </TextFieldWrapper>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.2rem !important;
`;

const AvatarContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  margin-bottom: 1rem;
  margin-right: 1rem;
`;
const AvatarMask = styled.div<{ background: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${props => props.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImg = styled.img<{ src: string }>`
  display: block;
  width: 100%;
  height: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;
const UploadButton = styled.div`
  margin-right: 1rem;
  padding: 0.75rem 2rem;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #fff;
  display: inline-block;
  background: rgba(115, 103, 240);
`;

const RemoveButton = styled.button`
  display: inline-block;
  border: 1px solid rgba(234, 84, 85, 1);
  background: transparent;
  color: rgba(234, 84, 85, 1);
  padding: 0.75rem 2rem;

  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

const ImgLabel = styled.p`
  color: #c2c6dc;
  margin-top: 0.5rem;
  font-size: 12.25px;
  width: 100%;
`;

const AvatarInitials = styled.span`
  font-size: 32px;
  color: #fff;
`;

type AvatarSettingsProps = {
  onProfileAvatarChange: () => void;
  onProfileAvatarRemove: () => void;
  profile: ProfileIcon;
};

const AvatarSettings: React.FC<AvatarSettingsProps> = ({ profile, onProfileAvatarChange, onProfileAvatarRemove }) => {
  return (
    <ProfileContainer>
      <AvatarContainer>
        <AvatarMask
          background={profile.url ? 'none' : profile.bgColor ?? 'none'}
          onClick={() => onProfileAvatarChange()}
        >
          {profile.url ? (
            <AvatarImg alt="" src={profile.url ?? ''} />
          ) : (
            <AvatarInitials>{profile.initials}</AvatarInitials>
          )}
        </AvatarMask>
      </AvatarContainer>
      <ActionButtons>
        <UploadButton onClick={() => onProfileAvatarChange()}>Upload photo</UploadButton>
        <RemoveButton onClick={() => onProfileAvatarRemove()}>Remove</RemoveButton>
        <ImgLabel>Allowed JPG, GIF or PNG. Max size of 800kB</ImgLabel>
      </ActionButtons>
    </ProfileContainer>
  );
};

const Container = styled.div`
  padding: 2.2rem;
  display: flex;
  width: 100%;
  position: relative;
`;

const TabNav = styled.div`
  float: left;
  width: 220px;
  height: 100%;
  display: block;
  position: relative;
`;

const TabNavContent = styled.ul`
  display: block;
  width: auto;
  border-bottom: 0 !important;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
`;

const TabNavItem = styled.li`
  padding: 0.35rem 0.3rem;
  display: block;
  position: relative;
`;
const TabNavItemButton = styled.button<{ active: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;

  padding-top: 10px !important;
  padding-bottom: 10px !important;
  padding-left: 12px !important;
  padding-right: 8px !important;
  width: 100%;
  position: relative;

  color: ${props => (props.active ? 'rgba(115, 103, 240)' : '#c2c6dc')};
  &:hover {
    color: rgba(115, 103, 240);
  }
  &:hover svg {
    fill: rgba(115, 103, 240);
  }
`;

const TabNavItemSpan = styled.span`
  text-align: left;
  padding-left: 9px;
  font-size: 14px;
`;

const TabNavLine = styled.span<{ top: number }>`
  left: auto;
  right: 0;
  width: 2px;
  height: 48px;
  transform: scaleX(1);
  top: ${props => props.top}px;

  background: linear-gradient(30deg, rgba(115, 103, 240), rgba(115, 103, 240));
  box-shadow: 0 0 8px 0 rgba(115, 103, 240);
  display: block;
  position: absolute;
  transition: all 0.2s ease;
`;

const TabContentWrapper = styled.div`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
`;

const TabContent = styled.div`
  position: relative;
  width: 100%;
  display: block;
  padding: 0;
  padding: 1.5rem;
  background-color: #10163a;
  margin-left: 1rem !important;
  border-radius: 0.5rem;
`;

const TabContentInner = styled.div``;

const items = [{ name: 'General' }, { name: 'Change Password' }, { name: 'Info' }, { name: 'Notifications' }];
type NavItemProps = {
  active: boolean;
  name: string;
  tab: number;
  onClick: (tab: number, top: number) => void;
};
const NavItem: React.FC<NavItemProps> = ({ active, name, tab, onClick }) => {
  const $item = useRef<HTMLLIElement>(null);
  return (
    <TabNavItem
      key={name}
      ref={$item}
      onClick={() => {
        if ($item && $item.current) {
          const pos = $item.current.getBoundingClientRect();
          onClick(tab, pos.top);
        }
      }}
    >
      <TabNavItemButton active={active}>
        <User size={14} color={active ? 'rgba(115, 103, 240)' : '#c2c6dc'} />
        <TabNavItemSpan>{name}</TabNavItemSpan>
      </TabNavItemButton>
    </TabNavItem>
  );
};

const SettingActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SaveButton = styled.div`
  margin-right: 1rem;
  padding: 0.75rem 2rem;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #fff;
  display: inline-block;
  background: rgba(115, 103, 240);
`;

type SettingsProps = {
  onProfileAvatarChange: () => void;
  onProfileAvatarRemove: () => void;
  profile: ProfileIcon;
};

const Settings: React.FC<SettingsProps> = ({ onProfileAvatarRemove, onProfileAvatarChange, profile }) => {
  const [currentTab, setTab] = useState(0);
  const [currentTop, setTop] = useState(0);
  const $tabNav = useRef<HTMLDivElement>(null);
  return (
    <Container>
      <TabNav ref={$tabNav}>
        <TabNavContent>
          {items.map((item, idx) => (
            <NavItem
              onClick={(tab, top) => {
                if ($tabNav && $tabNav.current) {
                  const pos = $tabNav.current.getBoundingClientRect();
                  setTab(tab);
                  setTop(top - pos.top);
                }
              }}
              name={item.name}
              tab={idx}
              active={idx === currentTab}
            />
          ))}
          <TabNavLine top={currentTop} />
        </TabNavContent>
      </TabNav>
      <TabContentWrapper>
        <TabContent>
          <AvatarSettings
            onProfileAvatarRemove={onProfileAvatarRemove}
            onProfileAvatarChange={onProfileAvatarChange}
            profile={profile}
          />
          <TextField label="Name" />
          <TextField label="Initials " />
          <TextField label="Username " />
          <TextField label="Email" />
          <TextField label="Bio" />
          <SettingActions>
            <SaveButton>Save Change</SaveButton>
          </SettingActions>
        </TabContent>
      </TabContentWrapper>
    </Container>
  );
};

export default Settings;
