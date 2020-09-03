import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const ScrollOverlay = styled.div`
  z-index: 3000;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const ClickableOverlay = styled.div`
  min-height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;

export const StyledModal = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: 0;
  right: 0;
  top: 48px;
  bottom: 16px;
  margin: auto;

  background: #262c49;
  vertical-align: middle;
  border-radius: 6px;
  ${mixin.boxShadowMedium}
`;
