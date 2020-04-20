import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const ScrollOverlay = styled.div`
  z-index: 1000000;
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
  display: flex;
  justify-content: center;
`;

export const StyledModal = styled.div<{ width: number }>`
  display: inline-block;
  position: relative;
  margin: 48px 0 80px;
  width: 100%;
  background: #262c49;
  max-width: ${props => props.width}px;
  vertical-align: middle;
  border-radius: 3px;
  ${mixin.boxShadowMedium}
`;
