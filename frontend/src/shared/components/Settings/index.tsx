import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { User } from 'shared/icons';
import Input from 'shared/components/Input';
import Button from 'shared/components/Button';
import { useForm } from 'react-hook-form';

const PasswordInput = styled(Input)`
  margin-top: 30px;
  margin-bottom: 0;
`;

const FormError = styled.span`
  font-size: 12px;
  color: rgba(${props => props.theme.colors.warning});
`;

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
const UploadButton = styled(Button)`
  margin-right: 1rem;
  display: inline-block;
`;

const RemoveButton = styled(Button)`
  display: inline-block;
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
        <RemoveButton variant="outline" color="danger" onClick={() => onProfileAvatarRemove()}>
          Remove
        </RemoveButton>
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
  margin-left: 1rem;
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
  border-radius: 0.5rem;
`;

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
  margin-top: 12px;
`;

const SaveButton = styled(Button)`
  margin-right: 1rem;
  display: inline-block;
`;

type SettingsProps = {
  onProfileAvatarChange: () => void;
  onProfileAvatarRemove: () => void;
  onResetPassword: (password: string, done: () => void) => void;
  profile: TaskUser;
};

type TabProps = {
  tab: number;
  currentTab: number;
};

const Tab: React.FC<TabProps> = ({ tab, currentTab, children }) => {
  if (tab !== currentTab) {
    return null;
  }
  return <TabContent>{children}</TabContent>;
};

type ResetPasswordTabProps = {
  onResetPassword: (password: string, done: () => void) => void;
};
const ResetPasswordTab: React.FC<ResetPasswordTabProps> = ({ onResetPassword }) => {
  const [active, setActive] = useState(true);
  const { register, handleSubmit, errors, setError, reset } = useForm<{ password: string; password_confirm: string }>();
  const done = () => {
    reset();
    setActive(true);
  };
  return (
    <form
      onSubmit={handleSubmit(data => {
        if (data.password !== data.password_confirm) {
          setError('password', { message: 'Passwords must match!', type: 'error' });
          setError('password_confirm', { message: 'Passwords must match!', type: 'error' });
        } else {
          onResetPassword(data.password, done);
        }
      })}
    >
      <PasswordInput
        width="100%"
        ref={register({ required: 'Password is required' })}
        label="Password"
        name="password"
      />
      {errors.password && <FormError>{errors.password.message}</FormError>}
      <PasswordInput
        width="100%"
        ref={register({ required: 'Password is required' })}
        label="Password (confirm)"
        name="password_confirm"
      />
      {errors.password_confirm && <FormError>{errors.password_confirm.message}</FormError>}
      <SettingActions>
        <SaveButton disabled={!active} type="submit">
          Save Change
        </SaveButton>
      </SettingActions>
    </form>
  );
};

const Settings: React.FC<SettingsProps> = ({
  onProfileAvatarRemove,
  onProfileAvatarChange,
  onResetPassword,
  profile,
}) => {
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
        <Tab tab={0} currentTab={currentTab}>
          <AvatarSettings
            onProfileAvatarRemove={onProfileAvatarRemove}
            onProfileAvatarChange={onProfileAvatarChange}
            profile={profile.profileIcon}
          />
          <Input defaultValue={profile.fullName} width="100%" label="Name" />
          <Input
            defaultValue={profile.profileIcon && profile.profileIcon.initials ? profile.profileIcon.initials : ''}
            width="100%"
            label="Initials "
          />
          <Input defaultValue={profile.username ?? ''} width="100%" label="Username " />
          <Input width="100%" label="Email" />
          <Input width="100%" label="Bio" />
          <SettingActions>
            <SaveButton>Save Change</SaveButton>
          </SettingActions>
        </Tab>
        <Tab tab={1} currentTab={currentTab}>
          <ResetPasswordTab onResetPassword={onResetPassword} />
        </Tab>
      </TabContentWrapper>
    </Container>
  );
};

export default Settings;
