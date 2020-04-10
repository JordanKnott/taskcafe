import styled from 'styled-components';

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
`;

export const LoginFormWrapper = styled.div`
  background: #10163a;
  width: 100%;
`;

export const LoginFormContainer = styled.div`
  min-height: 505px;
  padding: 2rem;
`;

export const Title = styled.h1`
  color: #ebeefd;
  font-size: 18px;
  margin-bottom: 14px;
`;

export const SubTitle = styled.h2`
  color: #c2c6dc;
  font-size: 14px;
  margin-bottom: 14px;
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
`;

export const FormIcon = styled.div`
  top: 30px;
  left: 16px;
  position: absolute;
`;

export const FormError = styled.span`
  font-size: 0.875rem;
  color: rgb(234, 84, 85);
`;

export const LoginButton = styled.input`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 6px;
  background: rgb(115, 103, 240);
  outline: none;
  border: none;
  cursor: pointer;
  color: #fff;
  &:disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
`;

export const ActionButtons = styled.div`
  margin-top: 17.5px;
  display: flex;
  justify-content: space-between;
`;

export const RegisterButton = styled.button`
  padding: 0.679rem 2rem;
  border-radius: 6px;
  border: 1px solid rgb(115, 103, 240);
  background: transparent;
  font-size: 1rem;
  color: rgba(115, 103, 240);
  cursor: pointer;
`;
