import styled from 'styled-components';
import Button from 'shared/components/Button';
import { mixin } from 'shared/utils/styles';
import AccessAccount from 'shared/undraw/AccessAccount';

export const Wrapper = styled.div`
  background: #eff2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const Column = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    svg {
      display: none;
    }
    position: absolute;
  }
`;

export const LoginFormWrapper = styled.div`
  background: #10163a;
  width: 100%;
`;

export const LoginFormContainer = styled.div`
  min-height: 505px;
  padding: 2rem;
  @media (max-width: 600px) {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border: solid black 1px;
    width: 600px;
    height: 1100px;
    box-shadow: 20px 20px 50px black;
  }
  @media (min-height: 641px) and (max-height: 653px) {
    margin-top: 25%;
  }
  @media (min-height: 654px) and (max-height: 823px) and (max-width: 500px) {
    margin-top: -20%;
  }
  @media (min-height: 480px) and (max-height: 639px) {
    margin-top: 20%;
  }
`;

export const Title = styled.h1`
  color: #ebeefd;
  font-size: 18px;
  margin-bottom: 14px;
  @media (max-width: 600px) {
    font-size: 38px;
    margin-top: 50px;
    text-align: center;
  }
`;

export const SubTitle = styled.h2`
  color: #c2c6dc;
  font-size: 14px;
  margin-bottom: 14px;
  @media (max-width: 600px) {
    margin-top: 30px;
    font-size: 24.5px;
    margin-bottom: 90px;
    text-align: center;
  }
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  color: #c2c6dc;
  font-size: 12px;
  position: relative;
  margin-top: 14px;
  @media (max-width: 600px) {
    font-size: 35px;
    font-weight: bold;
  }
`;

export const FormTextInput = styled.input`
  width: 100%;
  background: #262c49;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-top: 4px;
  padding: 0.7rem 1rem 0.7rem 3rem;
  font-size: 1rem;
  color: #c2c6dc;
  border-radius: 5px;

  @media (max-width: 600px) {
    border: 5px solid rgba(0, 0, 0, 0.2);
    border-radius: 5%;
    font-size: 30px;
    background-color: #353D64;
    color: black;
    padding: 0.7rem 1rem 1rem 3rem;
    text-align: center;
    &::placeholder {
      visibility: hidden;
    }

    &:not(:placeholder-shown) {
      background-color: white;
    }
  }
`;

export const FormIcon = styled.div`
  top: 30px;
  left: 16px;
  position: absolute;

  @media (max-width: 600px) {
    svg {
      width: 40px;
      height: 40px;
      display: inline;
      position: absolute;
      top: 30px;
      left: -5px;
    }
  }
`;

export const FormError = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.danger};
  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

export const LoginButton = styled(Button)`
  @media (max-width: 600px) {
    span {
      font-size: 40px;
      text-align: center;
      width: 100%;
    }
    align-self: center;
    position: absolute; 
    right: 0px;
    margin-top: 40%;
    width: 100%;
    &:hover {
      box-shadow: 5px 5px 20px white;
    }
  }
`;

export const ActionButtons = styled.div`
  margin-top: 17.5px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 600px) {
    width: 150px;
    align-content: center;
    font-size: 50px;
  }
`;

export const RegisterButton = styled(Button)`
  @media (max-width: 600px) {
    span {
      font-size: 40px;
      text-align: center;
      width: 100%;
    }
    width: 100%;
    position: absolute;
    left: 0px;
    margin-top: 29%;
  }
`;

export const LogoTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-left: 12px;
  transition: visibility, opacity, transform 0.25s ease;
  color: #7367f0;
  @media (max-width: 600px) {
    font-size: 60px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
  width: 100%;
  padding-bottom: 16px;
  margin-bottom: 24px;
  color: rgb(222, 235, 255);
  border-bottom: 1px solid ${(props) => mixin.rgba(props.theme.colors.alternate, 0.65)};
  @media (max-width: 600px) {
    svg {
      display: inline;
      width: 80px;
      height: 80px;
    }
  }
`;




