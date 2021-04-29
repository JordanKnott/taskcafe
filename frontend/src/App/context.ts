import React, { useContext } from 'react';

type UserContextState = {
  user: string | null;
  setUser: (user: string | null) => void;
};

export const UserContext = React.createContext<UserContextState>({
  user: null,
  setUser: _user => null,
});

export const useCurrentUser = () => {
  const { user, setUser } = useContext(UserContext);
  return {
    user,
    setUser,
  };
};

export default UserContext;
