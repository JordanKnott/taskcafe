import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const EntryWrapper = styled.div<{ isDragging: boolean; isSelected: boolean }>`
  position: relative;
  ${props =>
    props.isDragging &&
    css`
      &:before {
        border-radius: 3px;
        content: '';
        position: absolute;
        top: 2px;
        right: -5px;
        left: -5px;
        bottom: -2px;
        background-color: #eceef0;
      }
    `}
  ${props =>
    props.isSelected &&
    css`
      &:before {
        border-radius: 3px;
        content: '';
        position: absolute;
        top: 2px;
        right: -5px;
        bottom: -2px;
        left: -5px;
        background-color: ${mixin.rgba(props.theme.colors.primary, 0.75)};
      }
    `}
`;

export const EntryChildren = styled.div<{ isRoot: boolean }>`
  position: relative;
  ${props =>
    !props.isRoot &&
    css`
      margin-left: 10px;
      padding-left: 25px;
      border-left: 1px solid ${mixin.rgba(props.theme.colors.text.primary, 0.6)};
    `}
`;

export const PageContent = styled.div`
  min-height: calc(100vh - 146px);
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: none;
  user-select: none;
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
  padding-left: 56px;
  padding-right: 56px;
  padding-top: 24px;
  padding-bottom: 24px;
  text-size-adjust: none;
`;

export const DragHandle = styled.div<{ top: number; left: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  transform: translate3d(${props => props.left}px, ${props => props.top}px, 0);
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  width: 18px;
  height: 18px;
  color: rgb(75, 81, 85);
  border-radius: 9px;
`;
export const RootWrapper = styled.div``;

export const EntryHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 501px;
  top: 7px;
  width: 18px;
  height: 18px;
  color: ${p => p.theme.colors.text.primary};
  border-radius: 9px;
  &:hover {
    background: ${p => p.theme.colors.primary};
  }
  svg {
    fill: ${p => p.theme.colors.text.primary};
    stroke: ${p => p.theme.colors.text.primary};
  }
`;

export const EntryInnerContent = styled.div`
  padding-top: 4px;
  font-size: 15px;
  white-space: pre-wrap;
  line-height: 24px;
  min-height: 24px;
  overflow-wrap: break-word;
  position: relative;
  user-select: text;
  color: ${p => p.theme.colors.text.primary};
  &::selection {
    background: #a49de8;
  }
  &:focus {
    outline: 0;
  }
`;

export const DragDebugWrapper = styled.div`
  position: absolute;
  left: 42px;
  bottom: 24px;
  color: #fff;
`;

export const DragIndicatorBar = styled.div<{ left: number; top: number; width: number }>`
  position: absolute;
  width: ${props => props.width}px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  height: 4px;
  border-radius: 3px;
  background: rgb(204, 204, 204);
`;

export const ExpandButton = styled.div`
  top: 6px;
  cursor: default;
  color: transparent;
  position: absolute;
  top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 478px;
  width: 20px;
  height: 20px;
  svg {
    fill: transparent;
  }
`;
export const EntryContent = styled.div`
  position: relative;
  margin-left: -500px;
  padding-left: 524px;

  &:hover ${ExpandButton} svg {
    fill: ${props => props.theme.colors.text.primary};
  }
`;

export const PageContainer = styled.div`
  overflow: scroll;
`;
