import styled from 'styled-components/macro';

export const Container = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  position: absolute;
  padding-top: 10px;
  height: auto;
  width: auto;
  transform: translate(-100%);
  transition: opacity 0.25s, transform 0.25s, width 0.3s ease;
  z-index: 40000;
`;

export const Wrapper = styled.div`
  padding: 5px;
  padding-top: 8px;
  border-radius: 5px;
  box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0;

  color: #c2c6dc;
  background: #262c49;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
`;

export const WrapperDiamond = styled.div`
  top: 10px;
  right: 10px;
  position: absolute;
  width: 10px;
  height: 10px;
  display: block;
  transform: rotate(45deg) translate(-7px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 10;

  background: #262c49;
  border-color: #414561;
`;

export const ActionsList = styled.ul`
  min-width: 9rem;
  margin: 0;
  padding: 0;
`;

export const ActionItem = styled.li`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  &:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

export const ActionTitle = styled.span`
  margin-left: 0.5rem;
`;

export const Separator = styled.div`
  height: 1px;
  border-top: 1px solid #414561;
  margin: 0.25rem !important;
`;
