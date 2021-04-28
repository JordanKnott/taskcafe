import styled from 'styled-components';

export const Container = styled.div`
  user-select: none;
  white-space: nowrap;

  ::-webkit-scrollbar {
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #7367f0;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #10163a;
    border-radius: 6px;
  }
`;

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
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
export default Container;
