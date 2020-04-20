import React from 'react';

import { Exit, User } from 'shared/icons';
import { Separator, Container, WrapperDiamond, Wrapper, ActionsList, ActionItem, ActionTitle } from './Styles';

type DropdownMenuProps = {
  left: number;
  top: number;
  onLogout: () => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ left, top, onLogout }) => {
  return (
    <Container left={left} top={top}>
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
