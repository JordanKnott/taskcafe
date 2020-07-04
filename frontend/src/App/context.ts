import React from 'react';

type UserIDContextState = {
  userID: string | null;
  setUserID: (userID: string | null) => void;
};
export const UserIDContext = React.createContext<UserIDContextState>({ userID: null, setUserID: _userID => null });

export default UserIDContext;
