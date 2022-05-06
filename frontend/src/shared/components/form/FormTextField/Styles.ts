import { mixin } from 'shared/utils/styles';
import styled, { css } from 'styled-components/macro';

export const ErrorIcon = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Input = styled.input<{ hasError: boolean; hasIcon: boolean; width: string }>`
  width: 100%;
  background: ${(props) => props.theme.colors.form.textfield.background};
  border: 1px solid ${(props) => props.theme.colors.form.textfield.borderColor};
  margin-top: 4px;
  padding: ${(props) => (props.hasIcon ? '8px 8px 8px 34px' : '8px')};
  font-size: 14px;
  color: ${(props) => props.theme.colors.form.textfield.text};
  border-radius: 3px;
  height: 40px;
  transition: border-color 0.2s ease-in;
  &:focus {
    border-color: ${(props) => props.theme.colors.form.textfield.hover.borderColor};
  }
  &::placeholder {
    color: ${(props) => props.theme.colors.form.textfield.label};
  }
  ${(props) =>
    props.hasError &&
    css`
      border: 1px solid ${props.theme.colors.form.textfield.error};
      &:focus {
        border-color: ${props.theme.colors.form.textfield.error};
      }
    `}
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 40px;
  width: 40px;
  left: 0;
  bottom: 0;
`;

export const SecondaryLabel = styled.span`
  color: ${(props) => props.theme.colors.form.textfield.secondaryLabel};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const Label = styled.label<{ width: string }>`
  width: ${(props) => props.width};
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.form.textfield.label};
  font-size: 12px;
  position: relative;
`;

export const Error = styled.span`
  color: ${(props) => props.theme.colors.form.textfield.error};
  margin-top: 2px;
`;

export const Labels = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const LabelSpan = styled.span<{ visible: boolean }>`
  display: flex;
  opacity: 0;
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
  transform: translateY(4px);
  margin-bottom: 2px;
  ${(props) =>
    props.visible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`;
