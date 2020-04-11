import styled from 'styled-components';

export const ListActionsWrapper = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export const ListActionItemWrapper = styled.li`
  margin: 0;
  padding: 0;
`;
export const ListActionItem = styled.span`
  cursor: pointer;
  display: block;
  font-size: 14px;
  color: #172b4d;
  font-weight: 400;
  padding: 6px 12px;
  position: relative;
  margin: 0 -12px;
  text-decoration: none;
  &:hover {
    background-color: rgba(9, 30, 66, 0.04);
  }
`;

export const ListSeparator = styled.hr`
  background-color: rgba(9, 30, 66, 0.13);
  border: 0;
  height: 1px;
  margin: 8px 0;
  padding: 0;
  width: 100%;
`;
