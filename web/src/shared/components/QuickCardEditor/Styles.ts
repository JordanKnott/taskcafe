import styled, { keyframes } from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { mixin } from 'shared/utils/styles';

export const Wrapper = styled.div<{ open: boolean }>`
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
  color: #fff;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 30;
  visibility: ${props => (props.open ? 'show' : 'hidden')};
`;

export const Container = styled.div<{ top: number; left: number }>`
  position: absolute;
  width: 256px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`;

export const Editor = styled.div`
  background-color: ${props => mixin.lighten('#262c49', 0.05)};
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  color: #c2c6dc;
  padding: 6px 8px 2px;
  cursor: default;
  display: block;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 20px;
  position: relative;
  text-decoration: none;
  z-index: 1;
`;

export const EditorDetails = styled.div`
  overflow: hidden;
  padding: 0;
  position: relative;
  z-index: 10;
`;

export const EditorTextarea = styled(TextareaAutosize)`
  font-family: 'Droid Sans';
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
  height: 54px;
  width: 100%;

  background: none;
  border: none;
  box-shadow: none;
  margin-bottom: 4px;
  max-height: 162px;
  min-height: 54px;
  padding: 0;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  &:focus {
    border: none;
    outline: none;
  }
`;

export const SaveButton = styled.button`
  cursor: pointer;
  background: rgb(115, 103, 240);
  box-shadow: none;
  border: none;
  color: #fff;
  font-weight: 400;
  line-height: 20px;
  margin-top: 8px;
  margin-right: 4px;
  padding: 6px 24px;
  text-align: center;
  border-radius: 3px;
`;

export const FadeInAnimation = keyframes`
from { opacity: 0; transform: translateX(-20px); }
to { opacity: 1; transform: translateX(0); }
`;

export const EditorButtons = styled.div`
  left: 100%;
  position: absolute;
  top: 0;
  width: 240px;
  z-index: 0;
  animation: ${FadeInAnimation} 85ms ease-in 1;
`;

export const EditorButton = styled.div`
  cursor: pointer;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  clear: both;
  color: #e6e6e6;
  display: block;
  float: left;
  margin: 0 0 4px 8px;
  padding: 6px 12px 6px 8px;
  text-decoration: none;
  transition: transform 85ms ease-in;
`;

export const CloseButton = styled.div`
  padding: 9px;
  position: absolute;
  right: 0;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  opacity: 0.8;
  z-index: 40;
  cursor: pointer;
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
