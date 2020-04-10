import React, { useState } from 'react';
import TopNavbar from 'shared/components/TopNavbar';
import DropdownMenu from 'shared/components/DropdownMenu';

const GlobalTopNavbar: React.FC = () => {
  const [menu, setMenu] = useState({
    top: 0,
    left: 0,
    isOpen: false,
  });
  const onProfileClick = (bottom: number, right: number) => {
    setMenu({
      isOpen: !menu.isOpen,
      left: right,
      top: bottom,
    });
  };
  return (
    <>
      <TopNavbar onNotificationClick={() => console.log('beep')} onProfileClick={onProfileClick} />
      {menu.isOpen && <DropdownMenu left={menu.left} top={menu.top} />}
    </>
  );
};

export default GlobalTopNavbar;
