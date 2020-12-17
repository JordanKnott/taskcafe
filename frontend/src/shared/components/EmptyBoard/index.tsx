import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { mixin } from 'shared/utils/styles';
import theme from '../../../App/ThemeStyles';

export const BoardContainer = styled.div`
  position: relative;
  overflow-y: auto;
  outline: none;
  flex-grow: 1;
`;

export const BoardWrapper = styled.div`
  display: flex;

  user-select: none;
  white-space: nowrap;
  margin-bottom: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
export const Container = styled.div`
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
`;

export const defaultBaseColor = theme.colors.bg.primary;

export const defaultHighlightColor = mixin.lighten(theme.colors.bg.primary, 0.25);

export const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
  `;

export const Wrapper = styled.div`
  // background-color: #ebecf0;
  // background: rgb(244, 245, 247);
  min-height: 120px;
  opacity: 0.8;
  background: #10163a;
  color: #c2c6dc;

  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;

  background-image: linear-gradient(90deg, ${defaultBaseColor}, ${defaultHighlightColor}, ${defaultBaseColor});
  background-size: 200px 100%;
  background-repeat: no-repeat;

  animation: ${skeletonKeyframes} 1.2s ease-in-out infinite;
`;

const EmptyBoard: React.FC = () => {
  return (
    <BoardContainer>
      <BoardWrapper>
        <Container>
          <Wrapper />
        </Container>
        <Container>
          <Wrapper />
        </Container>
        <Container>
          <Wrapper />
        </Container>
        <Container>
          <Wrapper />
        </Container>
      </BoardWrapper>
    </BoardContainer>
  );
};

export default EmptyBoard;
