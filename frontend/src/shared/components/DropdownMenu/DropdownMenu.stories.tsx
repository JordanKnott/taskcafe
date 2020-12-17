import React, { createRef, useState } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import DropdownMenu from '.';
import theme from '../../../App/ThemeStyles';

export default {
  component: DropdownMenu,
  title: 'DropdownMenu',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#f8f8f8' },
      { name: 'darkBlue', value: theme.colors.bg.secondary, default: true },
    ],
  },
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Button = styled.div`
  font-size: 18px;
  padding: 15px 20px;
  color: #fff;
  background: #000;
`;

export const Default = () => {
  const [menu, setMenu] = useState({
    top: 0,
    left: 0,
    isOpen: false,
  });
  const $buttonRef: any = createRef();
  const onClick = () => {
    setMenu({
      isOpen: !menu.isOpen,
      left: $buttonRef.current.getBoundingClientRect().right,
      top: $buttonRef.current.getBoundingClientRect().bottom,
    });
  };
  return (
    <>
      <Container>
        <Button onClick={onClick} ref={$buttonRef}>
          Click me
        </Button>
      </Container>
      {menu.isOpen && (
        <DropdownMenu
          onAdminConsole={action('admin')}
          onCloseDropdown={() => {
            setMenu({ top: 0, left: 0, isOpen: false });
          }}
          onLogout={action('on logout')}
          left={menu.left}
          top={menu.top}
        />
      )}
    </>
  );
};
