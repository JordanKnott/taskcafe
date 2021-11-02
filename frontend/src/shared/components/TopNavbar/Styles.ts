import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';
import Button from 'shared/components/Button';
import { Taskcafe } from 'shared/icons';
import { NavLink, Link } from 'react-router-dom';
import TaskAssignee from 'shared/components/TaskAssignee';

export const ProjectMember = styled(TaskAssignee)<{ zIndex: number }>`
  z-index: ${(props) => props.zIndex};
  position: relative;

  box-shadow: 0 0 0 2px ${(props) => props.theme.colors.bg.primary},
    inset 0 0 0 1px ${(props) => mixin.rgba(props.theme.colors.bg.primary, 0.07)};
`;

export const NavbarWrapper = styled.div`
  width: 100%;
`;

export const ProjectMembers = styled.div`
  display: flex;
  align-items: center;
`;
export const NavbarHeader = styled.header`
  height: 80px;
  padding: 0 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.colors.bg.primary};
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid ${(props) => mixin.rgba(props.theme.colors.alternate, 0.65)};
`;
export const Breadcrumbs = styled.div`
  color: rgb(94, 108, 132);
  font-size: 15px;
`;
export const BreadcrumpSeparator = styled.span`
  position: relative;
  top: 2px;
  font-size: 18px;
  margin: 0px 10px;
`;
export const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ProjectSwitchInner = styled.div`
  border-radius: 12px;
  height: 48px;
  width: 48px;
  box-shadow: inset 0 -2px rgba(0, 0, 0, 0.05);
  align-items: center;
  background: #cbd4db;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;

  background-color: ${(props) => props.theme.colors.primary};
`;

export const ProjectSwitch = styled.div`
  align-self: center;
  position: relative;
  margin-right: 16px;
  cursor: pointer;
  &::after {
    border-radius: 12px;
    bottom: 0;
    content: '';
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
  }
  &:hover::after {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ProjectActions = styled.div`
  flex: 1;
  align-items: flex-start;
  display: flex;
  min-width: 1px;
`;

export const GlobalActions = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileNameWrapper = styled.div`
  text-align: right;
  line-height: 1.25;
`;

export const NavbarLink = styled(Link)`
  margin-right: 20px;
  cursor: pointer;
`;

export const NotificationCount = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #7367f0;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgb(16, 22, 58);
  color: #fff;
  font-size: 14px;
`;

export const IconContainerWrapper = styled.div<{ disabled?: boolean }>`
  margin-right: 20px;
  position: relative;
  cursor: pointer;
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    `}
`;

export const ProfileNamePrimary = styled.div`
  color: #c2c6dc;
  font-weight: 600;
`;

export const ProfileNameSecondary = styled.small`
  color: #c2c6dc;
`;

export const ProfileIcon = styled.div<{
  bgColor: string | null;
  backgroundURL: string | null;
}>`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: ${(props) => (props.backgroundURL ? `url(${props.backgroundURL})` : props.bgColor)};
  background-position: center;
  background-size: contain;
`;

export const ProjectMeta = styled.div<{ nameOnly?: boolean }>`
  display: flex;
  ${(props) => !props.nameOnly && 'padding-top: 9px;'}
  margin-left: -6px;
  align-items: center;
  max-width: 100%;
  min-height: 51px;
`;

export const ProjectTabs = styled.div`
  align-items: flex-end;
  align-self: stretch;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-start;
  max-width: 100%;
`;

export const ProjectTab = styled(NavLink)`
  font-size: 80%;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 15px;
  cursor: pointer;
  display: flex;
  line-height: normal;
  min-width: 1px;
  transition-duration: 0.2s;
  transition-property: box-shadow, color;
  white-space: nowrap;
  flex: 0 1 auto;
  padding-bottom: 12px;

  &:not(:last-child) {
    margin-right: 20px;
  }

  &:hover {
    box-shadow: inset 0 -2px ${(props) => props.theme.colors.text.secondary};
    color: ${(props) => props.theme.colors.text.secondary};
  }

  &.active {
    box-shadow: inset 0 -2px ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.secondary};
  }
  &.active:hover {
    box-shadow: inset 0 -2px ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.secondary};
  }
`;

export const ProjectName = styled.h1`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 600;
  font-size: 20px;
  padding: 3px 10px 3px 8px;
  margin: -4px 0;
`;

export const ProjectNameWrapper = styled.div`
  position: relative;
`;
export const ProjectNameSpan = styled.div`
  padding: 3px 10px 3px 8px;
  font-weight: 600;
  font-size: 20px;
`;
export const ProjectNameTextarea = styled.input`
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  border: none;
  resize: none;
  overflow: hidden;
  overflow-wrap: break-word;
  background: transparent;
  border-radius: 3px;
  box-shadow: none;
  margin: 0;

  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  flex-direction: column;
  text-align: start;

  color: #c2c6dc;
  font-weight: 600;
  font-size: 20px;
  padding: 3px 10px 3px 8px;
  &:focus {
    box-shadow: ${(props) => props.theme.colors.primary} 0px 0px 0px 1px;
  }
`;

export const ProjectSwitcher = styled.button`
  font-size: 20px;

  outline: none;
  border: none;
  width: 100px;
  border-radius: 3px;
  line-height: 20px;
  padding: 6px 4px;
  background-color: none;
  text-align: center;
  color: #c2c6dc;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
  }
`;

export const Separator = styled.div`
  color: #c2c6dc;
  font-size: 20px;
  padding-left: 4px;
  padding-right: 4px;
`;

export const ProjectSettingsButton = styled.button`
  outline: none;
  border: none;
  border-radius: 3px;
  line-height: 20px;
  width: 28px;
  height: 28px;
  background-color: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
  }
`;

export const InviteButton = styled(Button)`
  margin: 0 0 0 8px;
  padding: 6px 12px;
`;

export const ProjectFinder = styled(Button)`
  margin-right: 20px;
  padding: 6px 12px;
`;

export const SignUp = styled(Button)`
  margin-right: 8px;
  padding: 6px 12px;
`;

export const SignIn = styled(Button)`
  margin-right: 20px;
  padding: 6px 12px;
`;

export const NavSeparator = styled.div`
  width: 1px;
  background: ${(props) => props.theme.colors.border};
  height: 34px;
  margin: 0 20px;
`;

export const LogoContainer = styled(Link)`
  display: block;
  left: 50%;
  right: 50%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TaskcafeTitle = styled.h2`
  margin-left: 5px;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 20px;
`;

export const TaskcafeLogo = styled(Taskcafe)`
  fill: ${(props) => props.theme.colors.text.primary};
  stroke: ${(props) => props.theme.colors.text.primary};
`;
