import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const ProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ProjectTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
  transition: transform 0.25s ease;
  text-align: center;
`;
export const TeamTitle = styled.span`
  margin-top: 5px;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  color: #c2c6dc;
`;

export const ProjectWrapper = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  padding: 15px 25px;
  border-radius: 20px;
  ${mixin.boxShadowCard}
  background: ${props => mixin.darken(props.color, 0.35)};
  color: #fff;
  cursor: pointer;
  margin: 0 10px;
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;
