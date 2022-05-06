import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const Text = styled.span<{ color: string; size: string }>`
  position: relative;
  transition: all 0.2s ease;
  font-size: ${(props) => props.size};
  color: ${(props) => props.theme.colors.text[props.color]};
`;

export const Base = styled.button<{ width: string; color: string; disabled: boolean }>`
  width: ${(props) => props.width};
  transition: all 0.2s ease;
  position: relative;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: ${(props) => props.theme.borderRadius.alternate};

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    `}
`;

export const Filled = styled(Base)`
  background: ${(props) => props.theme.colors[props.color]};

  &:hover {
    box-shadow: 0 8px 25px -8px ${(props) => props.theme.colors[props.color]};
  }
`;

export const Outline = styled(Base)`
  border: 1px solid ${(props) => props.theme.colors[props.color]};
  background: transparent;
  & ${Text} {
    color: ${(props) => props.theme.colors[props.color]};
  }
  &:hover {
    background: ${(props) => mixin.rgba(props.theme.colors[props.color], 0.08)};
  }
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;
