import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

const Register = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  white-space: break-spaces;
  justify-content: center;
`;

const RegisterLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;
const Divider = styled.div`
  margin: 21px 0;
  text-align: center;
  overflow: hidden;
`;

const Alert = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px 14px;
  background-color: ${(props) => mixin.rgba(props.theme.colors.danger, 0.12)};
`;

const AlertIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const AlertContent = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.colors.danger};
`;

const DividerText = styled.div`
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

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const LeftContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.bg.primary};
  flex: 1 1 66.666%;
`;

const Logo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
`;
const LogoText = styled.span`
  font-size: 24px;
  margin-left: 14px;
`;

const RightContainer = styled.div`
  flex: 1 1 33.333%;
  background: ${(props) => props.theme.colors.bg.secondary};
  padding: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RightContent = styled.div`
  padding: 21px;
  width: 100%;
`;

const Welcome = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 16px;
`;

const AuthPageLayout: React.FC = ({ children }) => {
  return (
    <Container>
      <LeftContainer>
        <Logo>
          <LogoText>Taskcafe</LogoText>
        </Logo>
      </LeftContainer>
      <RightContainer>
        <RightContent>{children}</RightContent>
      </RightContainer>
    </Container>
  );
};

export default AuthPageLayout;
