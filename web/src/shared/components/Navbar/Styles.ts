import styled, { css } from 'styled-components';

export const LogoWrapper = styled.div`
  margin: 20px 0px 20px;

  position: relative;
  width: 100%;
  height: 42px;
  line-height: 42px;
  padding-left: 64px;
  color: rgb(222, 235, 255);
  cursor: pointer;
  user-select: none;
  transition: color 0.1s ease 0s;
`;

export const Logo = styled.div`
  position: absolute;
  left: 19px;
`;

export const LogoTitle = styled.div`
  position: relative;
  right: 12px;
  visibility: hidden;
  opacity: 0;
  font-size: 24px;
  font-weight: 600;
  transition: right 0.1s ease 0s, visibility, opacity, transform 0.25s ease;
  color: #7367f0;
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
`;

export const ActionButtonWrapper = styled.div<{ active?: boolean }>`
  ${props =>
    props.active &&
    css`
      background: rgb(115, 103, 240);
      box-shadow: 0 0 10px 1px rgba(115, 103, 240, 0.7);
    `}
  border-radius: 6px;
  cursor: pointer;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  &:hover ${ActionButtonTitle} {
    transform: translateX(5px);
  }
  &:hover ${IconWrapper} {
    transform: translateX(5px);
  }
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

  &:hover {
    width: 260px;
    box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 50px 0px;
  }
  &:hover ${LogoTitle} {
    right: 0px;
    visibility: visible;
    opacity: 1;
  }
  &:hover ${ActionButtonTitle} {
    left: 15px;
    visibility: visible;
    opacity: 1;
  }
`;
