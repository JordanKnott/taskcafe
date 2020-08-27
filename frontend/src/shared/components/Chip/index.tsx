import React from 'react';
import styled, { css } from 'styled-components';
import { Cross } from 'shared/icons';

const LabelText = styled.span`
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(${props => props.theme.colors.text.primary});
`;

const Container = styled.div<{ color?: string }>`
  margin: 0.75rem;
  min-height: 26px;
  min-width: 26px;
  font-size: 0.8rem;
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props =>
    props.color
      ? css`
          background: ${props.color};
          & ${LabelText} {
            color: rgba(${props.theme.colors.text.secondary});
          }
        `
      : css`
          background: rgba(${props.theme.colors.bg.primary});
        `}
`;

const CloseButton = styled.button`
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0 4px;
  background: rgba(0, 0, 0, 0.15);
  &:hover {
    background: rgba(0, 0, 0, 0.25);
  }
`;

type ChipProps = {
  label: string;
  onClose?: () => void;
  color?: string;
};

const Chip: React.FC<ChipProps> = ({ label, onClose, color }) => {
  return (
    <Container color={color}>
      <LabelText>{label}</LabelText>
      {onClose && (
        <CloseButton onClick={() => onClose()}>
          <Cross width={12} height={12} />
        </CloseButton>
      )}
    </Container>
  );
};

export default Chip;
