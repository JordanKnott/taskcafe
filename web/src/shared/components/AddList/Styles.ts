import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea/lib';

export const Container = styled.div``;

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
      background-color: #ebecf0;
      border-radius: 3px;
      height: auto;
      min-height: 32px;
      padding: 4px;
      transition: background 85ms ease-in, opacity 40ms ease-in, border-color 85ms ease-in;
    `}
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
  background: #fff;
  border: none;
  box-shadow: inset 0 0 0 2px #0079bf;
  display: block;
  margin: 0;
  transition: margin 85ms ease-in, background 85ms ease-in;
  width: 100%;
  line-height: 20px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
`;

export const ListAddControls = styled.div`
  height: 32px;
  transition: margin 85ms ease-in, height 85ms ease-in;
  overflow: hidden;
  margin: 4px 0 0;
`;

export const AddListButton = styled.button`
  background-color: #5aac44;
  box-shadow: none;
  border: none;
  color: #fff;
  float: left;
  margin: 0 4px 0 0;
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  line-height: 20px;
  padding: 6px 12px;
  text-align: center;
  border-radius: 3px;
  font-size: 14px;
`;

export const CancelAdd = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;
