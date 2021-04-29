import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { mixin } from 'shared/utils/styles';
import Button from 'shared/components/Button';

export const Container = styled.div`
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
`;

export const Wrapper = styled.div<{ editorOpen: boolean }>`
  display: inline-block;
  background-color: hsla(0, 0%, 100%, 0.24);
  cursor: pointer;
  border-radius: 3px;
  height: auto;
  min-height: 32px;
  padding: 4px;
  transition: background 85ms ease-in, opacity 40ms ease-in, border-color 85ms ease-in;
  width: 272px;
  margin: 0 4px;
  margin-right: 8px;

  ${props =>
    !props.editorOpen &&
    css`
      &:hover {
        background-color: hsla(0, 0%, 100%, 0.32);
      }
    `}

  ${props =>
    props.editorOpen &&
    css`
      background-color: #10163a;
      border-radius: 3px;
      height: auto;
      min-height: 32px;
      padding: 8px;
      transition: background 85ms ease-in, opacity 40ms ease-in, border-color 85ms ease-in;
    `}
`;

export const AddListButton = styled(Button)`
  padding: 6px 12px;
`;

export const Placeholder = styled.span`
  color: #c2c6dc;
  display: flex;
  align-items: center;
  padding: 6px 8px;
  transition: color 85ms ease-in;
`;

export const AddIconWrapper = styled.div`
  color: #fff;
  margin-right: 6px;
`;

export const ListNameEditorWrapper = styled.div`
  display: flex;
`;
export const ListNameEditor = styled(TextareaAutosize)`
  background-color: ${props => mixin.lighten(props.theme.colors.bg.secondary, 0.05)};
  border: none;
  box-shadow: inset 0 0 0 2px #0079bf;
  transition: margin 85ms ease-in, background 85ms ease-in;
  line-height: 20px;
  padding: 8px 12px;

  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
  height: 54px;
  width: 100%;

  border: none;
  border-radius: 3px;
  box-shadow: none;
  margin-bottom: 4px;
  max-height: 162px;
  min-height: 54px;
  font-size: 14px;
  line-height: 20px;

  color: #c2c6dc;
  l &:focus {
    background-color: ${props => mixin.lighten(props.theme.colors.bg.secondary, 0.05)};
  }
`;

export const ListAddControls = styled.div`
  height: 32px;
  transition: margin 85ms ease-in, height 85ms ease-in;
  overflow: hidden;
  margin: 4px 0 0;
`;

export const CancelAdd = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;
