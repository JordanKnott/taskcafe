import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const Register = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  white-space: break-spaces;
  justify-content: center;
`;

export const RegisterLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;
export const Divider = styled.div`
  margin: 21px 0;
  text-align: center;
  overflow: hidden;
`;

export const Alert = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px 14px;
  background-color: ${(props) => mixin.rgba(props.theme.colors.danger, 0.12)};
`;

export const AlertIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const AlertContent = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.colors.danger};
`;

export const DividerText = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 14px;
  &:before {
    right: 100%;
    border-top: 1px solid ${(props) => props.theme.colors.border.primary};
    content: '';
    position: absolute;
    top: 50%;
    width: 9999px;
  }
  &:after {
    left: 100%;
    border-top: 1px solid ${(props) => props.theme.colors.border.primary};
    content: '';
    position: absolute;
    top: 50%;
    width: 9999px;
  }
`;

export const Welcome = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 16px;
`;
