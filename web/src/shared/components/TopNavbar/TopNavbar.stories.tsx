import React, { useState } from 'react';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import { action } from '@storybook/addon-actions';
import DropdownMenu from 'shared/components/DropdownMenu';
import TopNavbar from '.';

export default {
  component: TopNavbar,
  title: 'TopNavbar',

  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#f8f8f8' },
      { name: 'darkBlue', value: '#262c49', default: true },
    ],
  },
};

export const Default = () => {
  const [menu, setMenu] = useState({
    top: 0,
    left: 0,
    isOpen: false,
  });
  const onClick = (bottom: number, right: number) => {
    setMenu({
      isOpen: !menu.isOpen,
      left: right,
      top: bottom,
    });
  };
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <TopNavbar
        projectName="Projects"
        bgColor="#7367F0"
        firstName="Jordan"
        lastName="Knott"
        initials="JK"
        onNotificationClick={action('notifications click')}
        onProfileClick={onClick}
      />
      {menu.isOpen && (
        <DropdownMenu
          onCloseDropdown={() => {
            setMenu({ left: 0, top: 0, isOpen: false });
          }}
          onLogout={action('on logout')}
          left={menu.left}
          top={menu.top}
        />
      )}
    </>
  );
};
