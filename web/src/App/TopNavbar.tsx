import React, { useState, useContext } from 'react';
import TopNavbar from 'shared/components/TopNavbar';
import DropdownMenu from 'shared/components/DropdownMenu';
import { useHistory } from 'react-router';
import UserIDContext from 'App/context';
import { useMeQuery } from 'shared/generated/graphql';

type GlobalTopNavbarProps = {
  name: string;
};
const GlobalTopNavbar: React.FC<GlobalTopNavbarProps> = ({ name }) => {
  const { loading, data } = useMeQuery();
  const history = useHistory();
  const { userID, setUserID } = useContext(UserIDContext);
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

  const onLogout = () => {
    fetch('http://localhost:3333/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      if (status === 200) {
        history.replace('/login');
        setUserID(null);
      }
    });
  };
  if (!userID) {
    return null;
  }
  console.log(data);
  return (
    <>
      <TopNavbar
        projectName={name}
        bgColor={data ? data.me.profileIcon.bgColor ?? '#7367F0' : '#7367F0'}
        firstName={data ? data.me.firstName : ''}
        lastName={data ? data.me.lastName : ''}
        initials={!data ? '' : data.me.profileIcon.initials ?? ''}
        onNotificationClick={() => console.log('beep')}
        onProfileClick={onProfileClick}
      />
      {menu.isOpen && (
        <DropdownMenu
          onCloseDropdown={() => {
            setMenu({
              top: 0,
              left: 0,
              isOpen: false,
            });
          }}
          onLogout={onLogout}
          left={menu.left}
          top={menu.top}
        />
      )}
    </>
  );
};

export default GlobalTopNavbar;
