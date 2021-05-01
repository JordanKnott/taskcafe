import styled from 'styled-components';
import Button from 'shared/components/Button';

export const OptionWrapper = styled.div<{ isFocused: boolean }>`
  cursor: pointer;
  padding: 4px 8px;
  ${props => props.isFocused && `background: rgba(${props.theme.colors.primary});`}
  display: flex;
  align-items: center;
`;

export const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export const OptionLabel = styled.span<{ fontSize: number; quiet: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${p => p.fontSize}px;
  color: rgba(${p => (p.quiet ? p.theme.colors.text.primary : p.theme.colors.text.primary)});
`;

export const OptionValueWrapper = styled.div`
  background: rgba(${props => props.theme.colors.bg.primary});
  border-radius: 4px;
  margin: 2px;
  padding: 3px 6px 3px 4px;
  display: flex;
  align-items: center;
`;

export const OptionValueLabel = styled.span`
  font-size: 12px;
  color: rgba(${props => props.theme.colors.text.secondary});
`;

export const OptionValueRemove = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  margin-left: 4px;
`;

export const InviteButton = styled(Button)`
  margin-top: 12px;
  height: 32px;
  padding: 4px 12px;
  width: 100%;
  justify-content: center;
`;

export const InviteContainer = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;
