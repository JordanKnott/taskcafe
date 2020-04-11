import React, { useRef } from 'react';
import { Cross } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { Container, Header, HeaderTitle, Content, CloseButton } from './Styles';

type Props = {
  title: string;
  top: number;
  left: number;
  onClose: () => void;
};

const PopupMenu: React.FC<Props> = ({ title, top, left, onClose, children }) => {
  const $containerRef = useRef();
  useOnOutsideClick($containerRef, true, onClose, null);

  return (
    <Container left={left} top={top} ref={$containerRef}>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        <CloseButton onClick={() => onClose()}>
          <Cross />
        </CloseButton>
      </Header>
      <Content>{children}</Content>
    </Container>
  );
};

export default PopupMenu;
