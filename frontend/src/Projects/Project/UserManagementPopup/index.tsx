import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useApolloClient } from '@apollo/react-hooks';
import { colourStyles } from 'shared/components/Select';
import { Popup } from 'shared/components/PopupMenu';
import OptionValue from './OptionValue';
import UserOption from './UserOption';
import fetchMembers from './fetchMembers';
import * as S from './Styles';

type InviteUserData = {
  email?: string;
  userID?: string;
};

type UserManagementPopupProps = {
  projectID: string;
  users: Array<User>;
  projectMembers: Array<TaskUser>;
  onInviteProjectMembers: (data: Array<InviteUserData>) => void;
};

const UserManagementPopup: React.FC<UserManagementPopupProps> = ({
  projectID,
  users,
  projectMembers,
  onInviteProjectMembers,
}) => {
  const client = useApolloClient();
  const [invitedUsers, setInvitedUsers] = useState<Array<any> | null>(null);
  return (
    <Popup tab={0} title="Invite a user">
      <S.InviteContainer>
        <AsyncSelect
          getOptionValue={option => option.value.id}
          placeholder="Email address or username"
          noOptionsMessage={() => null}
          onChange={(e: any) => {
            setInvitedUsers(e);
          }}
          isMulti
          autoFocus
          cacheOptions
          styles={colourStyles}
          defaultOption
          components={{
            MultiValue: OptionValue,
            Option: UserOption,
            IndicatorSeparator: null,
            DropdownIndicator: null,
          }}
          loadOptions={(i, cb) => fetchMembers(client, projectID, {}, i, cb)}
        />
      </S.InviteContainer>
      <S.InviteButton
        onClick={() => {
          if (invitedUsers) {
            onInviteProjectMembers(
              invitedUsers.map(user => {
                if (user.value.type === 0) {
                  return {
                    userID: user.value.id,
                  };
                }
                return {
                  email: user.value.id,
                };
              }),
            );
          }
        }}
        disabled={invitedUsers === null}
        hoverVariant="none"
        fontSize="16px"
      >
        Send Invite
      </S.InviteButton>
    </Popup>
  );
};

export default UserManagementPopup;
