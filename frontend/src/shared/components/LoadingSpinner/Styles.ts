import styled, { keyframes } from 'styled-components';

const LoadingSpinnerKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinnerWrapper = styled.div<{ color: string; size: string; borderSize: string; thickness: string }>`
  display: inline-block;
  position: relative;
  width: ${props => props.borderSize};
  height: ${props => props.borderSize};

  & > div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${props => props.size};
    height: ${props => props.size};
    margin: ${props => props.thickness};
    border: ${props => props.thickness} solid ${props => props.theme.colors[props.color]};
    border-radius: 50%;
    animation: 1.2s ${LoadingSpinnerKeyframes} cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.theme.colors[props.color]} transparent transparent transparent;
  }

  & > div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & > div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & > div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

export default LoadingSpinnerWrapper;
