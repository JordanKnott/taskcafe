import styled, { css } from 'styled-components';
import Button from 'shared/components/Button';
import { Checkmark } from 'shared/icons';
import { mixin } from 'shared/utils/styles';

export const RoleCheckmark = styled(Checkmark)`
  padding-left: 4px;
`;
export const Profile = styled.div`
  margin: 8px 0;
  min-height: 56px;
  position: relative;
`;

export const ProfileIcon = styled.div<{ bgUrl: string | null; bgColor: string }>`
  float: left;
  margin: 2px;
  background: ${props => (props.bgUrl ? `url(${props.bgUrl})` : props.bgColor)};
  background-position: center;
  background-size: contain;
  border-radius: 25em;
  font-size: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  overflow: hidden;
  position: relative;
  width: 50px;
  z-index: 1;
`;

export const ProfileInfo = styled.div`
  color: #c2c6dc;
  margin: 0 0 0 64px;
  word-wrap: break-word;
`;

export const InfoTitle = styled.h3`
  margin: 0 40px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #c2c6dc;
`;

export const InfoUsername = styled.p`
  color: #c2c6dc;
  font-size: 14px;
  line-height: 20px;
`;

export const InfoBio = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #c2c6dc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0;
`;

export const MiniProfileActions = styled.ul`
  list-style-type: none;
`;

export const MiniProfileActionWrapper = styled.li``;

export const MiniProfileActionItem = styled.span<{ disabled?: boolean }>`
  color: #c2c6dc;
  display: block;
  font-weight: 400;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;

  ${props =>
    props.disabled
      ? css`
          user-select: none;
          pointer-events: none;
          color: ${mixin.rgba(props.theme.colors.text.primary, 0.4)};
        `
      : css`
          cursor: pointer;
          &:hover {
            background: ${props.theme.colors.primary};
          }
        `}
`;

export const CurrentPermission = styled.span`
  margin-left: 4px;
  color: ${props => mixin.rgba(props.theme.colors.text.secondary, 0.4)};
`;

export const Separator = styled.div`
  height: 1px;
  border-top: 1px solid ${props => props.theme.colors.alternate};
  margin: 0.25rem !important;
`;

export const WarningText = styled.span`
  display: flex;
  color: ${props => mixin.rgba(props.theme.colors.text.primary, 0.4)};
  padding: 6px;
`;

export const DeleteDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
`;

export const RemoveMemberButton = styled(Button)`
  margin-top: 16px;
  padding: 6px 12px;
  width: 100%;
`;

export const Content = styled.div`
  padding: 0 12px 12px;
`;

export const RoleName = styled.div`
  font-size: 14px;
  font-weight: 700;
`;
export const RoleDescription = styled.div`
  margin-top: 4px;
  font-size: 14px;
`;
