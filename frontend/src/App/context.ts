import React, { useContext } from 'react';

export enum PermissionLevel {
  ORG,
  TEAM,
  PROJECT,
}

export enum PermissionObjectType {
  ORG,
  TEAM,
  PROJECT,
  TASK,
}

export type CurrentUserRoles = {
  org: string;
  teams: Map<string, string>;
  projects: Map<string, string>;
};

export interface CurrentUserRaw {
  id: string;
  roles: CurrentUserRoles;
}

type UserContextState = {
  user: CurrentUserRaw | null;
  setUser: (user: CurrentUserRaw | null) => void;
  setUserRoles: (roles: CurrentUserRoles) => void;
};
export const UserContext = React.createContext<UserContextState>({
  user: null,
  setUser: _user => null,
  setUserRoles: roles => null,
});

export interface CurrentUser extends CurrentUserRaw {
  isAdmin: (level: PermissionLevel, objectType: PermissionObjectType, subjectID?: string | null) => boolean;
  isVisible: (level: PermissionLevel, objectType: PermissionObjectType, subjectID?: string | null) => boolean;
}

export const useCurrentUser = () => {
  const { user, setUser, setUserRoles } = useContext(UserContext);
  let currentUser: CurrentUser | null = null;
  if (user) {
    currentUser = {
      ...user,
      isAdmin(level: PermissionLevel, objectType: PermissionObjectType, subjectID?: string | null) {
        if (user.roles.org === 'admin') {
          return true;
        }
        switch (level) {
          case PermissionLevel.TEAM:
            return subjectID ? this.roles.teams.get(subjectID) === 'admin' : false;
          default:
            return false;
        }
      },
      isVisible(level: PermissionLevel, objectType: PermissionObjectType, subjectID?: string | null) {
        if (user.roles.org === 'admin') {
          return true;
        }
        switch (level) {
          case PermissionLevel.TEAM:
            return subjectID ? this.roles.teams.get(subjectID) !== null : false;
          default:
            return false;
        }
      },
    };
  }
  return {
    user: currentUser,
    setUser,
    setUserRoles,
  };
};

export default UserContext;
