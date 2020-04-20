import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mixin } from 'shared/utils/styles';

export const ClockIcon = styled(FontAwesomeIcon)``;

export const ListCardBadges = styled.div`
  float: left;
  display: flex;
  max-width: 100%;
  margin-left: -2px;
`;

export const ListCardBadge = styled.div`
  color: #5e6c84;
  display: flex;
  align-items: center;
  margin: 0 6px 4px 0;
  max-width: 100%;
  min-height: 20px;
  overflow: hidden;
  position: relative;
  padding: 2px;
  text-decoration: none;
  text-overflow: ellipsis;
  vertical-align: top;
`;

export const DescriptionBadge = styled(ListCardBadge)`
  padding-right: 6px;
`;

export const DueDateCardBadge = styled(ListCardBadge)<{ isPastDue: boolean }>`
  ${props =>
    props.isPastDue &&
    css`
      padding-left: 4px;
      background-color: #ec9488;
      border-radius: 3px;
      color: #fff;
    `}
`;

export const ListCardBadgeText = styled.span`
  font-size: 12px;
  padding: 0 4px 0 6px;
  vertical-align: top;
  white-space: nowrap;
`;

export const ListCardContainer = styled.div<{ isActive: boolean }>`
  max-width: 256px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 3px;
  ${mixin.boxShadowCard}
  cursor: pointer !important;
  position: relative;

  background-color: ${props => (props.isActive ? mixin.darken('#262c49', 0.1) : mixin.lighten('#262c49', 0.05))};
`;

export const ListCardInnerContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const ListCardDetails = styled.div`
  overflow: hidden;
  padding: 6px 8px 2px;
  position: relative;
  z-index: 10;
`;

export const ListCardLabels = styled.div`
  overflow: auto;
  position: relative;
`;

export const ListCardLabel = styled.span`
  height: 16px;
  line-height: 16px;
  padding: 0 8px;
  max-width: 198px;
  float: left;
  font-size: 12px;
  font-weight: 700;
  margin: 0 4px 4px 0;
  width: auto;
  border-radius: 4px;
  color: #fff;
  display: block;
  position: relative;
  background-color: ${props => props.color};
`;

export const ListCardOperation = styled.span`
  display: flex;
  align-content: center;
  justify-content: center;
  border-radius: 3px;
  opacity: 0.8;
  padding: 6px;
  position: absolute;
  right: 2px;
  top: 2px;
  z-index: 10;

  &:hover {
    background-color: ${props => mixin.darken('#262c49', 0.45)};
  }
`;

export const CardTitle = styled.span`
  font-family: 'Droid Sans';
  clear: both;
  display: block;
  margin: 0 0 4px;
  overflow: hidden;
  text-decoration: none;
  word-wrap: break-word;
  color: #c2c6dc;
`;

export const CardMembers = styled.div`
  float: right;
  margin: 0 -2px 0 0;
`;

export const CardMember = styled.div<{ bgColor: string }>`
  height: 28px;
  width: 28px;
  float: right;
  margin: 0 0 4px 4px;

  background-color: ${props => props.bgColor};
  color: #fff;
  border-radius: 25em;
  cursor: pointer;
  display: block;
  overflow: visible;
  position: relative;
  text-decoration: none;
  z-index: 0;
`;

export const CardMemberInitials = styled.div`
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;
