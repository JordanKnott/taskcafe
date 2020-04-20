import React, { useRef } from 'react';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { Exit, User } from 'shared/icons';
import { Separator, Container, WrapperDiamond, Wrapper, ActionsList, ActionItem, ActionTitle } from './Styles';

type DropdownMenuProps = {
  left: number;
  top: number;
  onLogout: () => void;
  onCloseDropdown: () => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ left, top, onLogout, onCloseDropdown }) => {
  const $containerRef = useRef<HTMLDivElement>(null);
  useOnOutsideClick($containerRef, true, onCloseDropdown, null);
  return (
    <Container ref={$containerRef} left={left} top={top}>
      <Wrapper>
        <ActionItem>
          <User size={16} color="#c2c6dc" />
          <ActionTitle>Profile</ActionTitle>
        </ActionItem>
        <Separator />
        <ActionsList>
          <ActionItem onClick={onLogout}>
            <Exit size={16} color="#c2c6dc" />
            <ActionTitle>Logout</ActionTitle>
          </ActionItem>
        </ActionsList>
      </Wrapper>
      <WrapperDiamond />
    </Container>
  );
};

export default DropdownMenu;
