import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const Logo = styled.div``;

export const LogoTitle = styled.div`
  position: absolute;
  visibility: hidden;
  opacity: 0;
  font-size: 24px;
  font-weight: 600;
  transition: visibility, opacity, transform 0.25s ease;
  color: #22ff00;
`;
export const ActionContainer = styled.div`
  position: relative;
`;

export const ActionButtonTitle = styled.span`
  position: relative;
  visibility: hidden;
  left: -5px;
  opacity: 0;
  font-weight: 600;
  transition: left 0.1s ease 0s, visibility, opacity, transform 0.25s ease;

  font-size: 18px;
  color: #c2c6dc;
`;
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
`;

export const ActionButtonContainer = styled.div`
  padding: 0 12px;
  position: relative;

  & > a:first-child > div {
    padding-top: 48px;
  }
`;

export const ActionButtonWrapper = styled.div<{ active?: boolean }>`
  ${props =>
    props.active &&
    css`
      background: ${props.theme.colors.primary};
      box-shadow: 0 0 10px 1px ${mixin.rgba(props.theme.colors.primary, 0.7)};
    `}
  border-radius: 6px;
  cursor: pointer;
  padding: 24px 15px;
  display: flex;
  align-items: center;
  &:hover ${ActionButtonTitle} {
    transform: translateX(5px);
  }
  &:hover ${IconWrapper} {
    transform: translateX(5px);
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 80px;
  color: rgb(222, 235, 255);
  cursor: pointer;
  transition: color 0.1s ease 0s, border 0.1s ease 0s;
  border-bottom: 1px solid ${props => mixin.rgba(props.theme.colors.alternate, 0.65)};
`;

export const Container = styled.aside`
  z-index: 100;
  position: fixed;
  top: 0px;
  left: 0px;
  overflow-x: hidden;
  height: 100vh;
  width: 80px;
  transform: translateZ(0px);
  background: #10163a;
  transition: all 0.1s ease 0s;
  border-right: 1px solid ${props => mixin.rgba(props.theme.colors.alternate, 0.65)};

  &:hover {
    width: 260px;
    box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 50px 0px;
    border-right: 1px solid ${props => mixin.rgba(props.theme.colors.alternate, 0)};
  }
  &:hover ${LogoTitle} {
    bottom: -12px;
    visibility: visible;
    opacity: 1;
  }
  &:hover ${ActionButtonTitle} {
    left: 15px;
    visibility: visible;
    opacity: 1;
  }

  &:hover ${LogoWrapper} {
    border-bottom: 1px solid ${props => mixin.rgba(props.theme.colors.alternate, 0)};
  }
`;
