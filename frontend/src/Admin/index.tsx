import React, { useEffect } from 'react';
import Admin from 'shared/components/Admin';
import Select from 'shared/components/Select';
import GlobalTopNavbar from 'App/TopNavbar';
import {
  useUsersQuery,
  useDeleteUserAccountMutation,
  useDeleteInvitedUserAccountMutation,
  useCreateUserAccountMutation,
  UsersDocument,
  UsersQuery,
} from 'shared/generated/graphql';
import styled from 'styled-components';
import Button from 'shared/components/Button';
import { useForm, Controller, UseFormSetError } from 'react-hook-form';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import produce from 'immer';
import updateApolloCache from 'shared/utils/cache';
import { useCurrentUser } from 'App/context';
import { Redirect } from 'react-router';
import NOOP from 'shared/utils/noop';
import ControlledInput from 'shared/components/ControlledInput';
import FormInput from 'shared/components/FormInput';

const DeleteUserWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeleteUserDescription = styled.p`
  font-size: 14px;
`;

const DeleteUserButton = styled(Button)`
  margin-top: 6px;
  padding: 6px 12px;
  width: 100%;
`;

type DeleteUserPopupProps = {
  onDeleteUser: () => void;
};

const DeleteUserPopup: React.FC<DeleteUserPopupProps> = ({ onDeleteUser }) => {
  return (
    <DeleteUserWrapper>
      <DeleteUserDescription>Deleting this user will remove all user related data.</DeleteUserDescription>
      <DeleteUserButton onClick={() => onDeleteUser()} color="danger">
        Delete user
      </DeleteUserButton>
    </DeleteUserWrapper>
  );
};

type RoleCodeOption = {
  label: string;
  value: string;
};

type CreateUserData = {
  email: string;
  username: string;
  fullName: string;
  initials: string;
  password: string;
  roleCode: RoleCodeOption;
};

const CreateUserForm = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 12px;
`;

const CreateUserButton = styled(Button)`
  margin-top: 8px;
  padding: 6px 12px;
  width: 100%;
`;

const AddUserInput = styled(FormInput)`
  margin-bottom: 8px;
`;

const InputError = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: 12px;
`;

type AddUserPopupProps = {
  onAddUser: (user: CreateUserData, setError: UseFormSetError<CreateUserData>) => void;
};

const AddUserPopup: React.FC<AddUserPopupProps> = ({ onAddUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<CreateUserData>();

  const createUser = (data: CreateUserData) => {
    onAddUser(data, setError);
  };
  return (
    <CreateUserForm onSubmit={handleSubmit(createUser)}>
      <AddUserInput
        width="100%"
        label="Full Name"
        variant="alternate"
        {...register('fullName', { required: 'Full name is required' })}
      />
      {errors.fullName && <InputError>{errors.fullName.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Email"
        variant="alternate"
        {...register('email', { required: 'Email is required' })}
      />
      {errors.email && <InputError>{errors.email.message}</InputError>}
      <Controller
        control={control}
        name="roleCode"
        rules={{ required: 'Role is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Role"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Member', value: 'member' },
            ]}
          />
        )}
      />
      {errors.roleCode && errors.roleCode.value && <InputError>{errors.roleCode.value.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Username"
        variant="alternate"
        {...register('username', { required: 'Username is required' })}
      />
      {errors.username && <InputError>{errors.username.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Initials"
        variant="alternate"
        {...register('initials', { required: 'Initials is required' })}
      />
      {errors.initials && <InputError>{errors.initials.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Password"
        variant="alternate"
        type="password"
        {...register('password', { required: 'Password is required' })}
      />
      {errors.password && <InputError>{errors.password.message}</InputError>}
      <CreateUserButton type="submit">Create</CreateUserButton>
    </CreateUserForm>
  );
};

const AdminRoute = () => {
  useEffect(() => {
    document.title = 'Admin | Taskcafé';
  }, []);
  const { loading, data } = useUsersQuery({ fetchPolicy: 'cache-and-network' });
  const { showPopup, hidePopup } = usePopup();
  const { user } = useCurrentUser();
  const [deleteInvitedUser] = useDeleteInvitedUserAccountMutation({
    update: (client, response) => {
      updateApolloCache<UsersQuery>(client, UsersDocument, (cache) =>
        produce(cache, (draftCache) => {
          draftCache.invitedUsers = cache.invitedUsers.filter(
            (u) => u.id !== response.data?.deleteInvitedUserAccount.invitedUser.id,
          );
        }),
      );
    },
  });
  const [deleteUser] = useDeleteUserAccountMutation({
    update: (client, response) => {
      updateApolloCache<UsersQuery>(client, UsersDocument, (cache) =>
        produce(cache, (draftCache) => {
          draftCache.users = cache.users.filter((u) => u.id !== response.data?.deleteUserAccount.userAccount.id);
        }),
      );
    },
  });
  const [createUser] = useCreateUserAccountMutation({
    update: (client, createData) => {
      const cacheData: any = client.readQuery({
        query: UsersDocument,
      });
      const newData = produce(cacheData, (draftState: any) => {
        draftState.users = [...draftState.users, { ...createData.data?.createUserAccount }];
      });

      client.writeQuery({
        query: UsersDocument,
        data: {
          ...newData,
        },
      });
    },
  });
  if (data && user) {
    /*
TODO: add permision check
    if (user.roles.org !== 'admin') {
      return <Redirect to="/" />;
    }
     */
    return (
      <>
        <GlobalTopNavbar projectID={null} onSaveProjectName={NOOP} name={null} />
        <Admin
          initialTab={0}
          users={data.users}
          invitedUsers={data.invitedUsers}
          // canInviteUser={user.roles.org === 'admin'} TODO: add permision check
          canInviteUser
          onInviteUser={NOOP}
          onUpdateUserPassword={() => {
            hidePopup();
          }}
          onDeleteInvitedUser={(invitedUserID) => {
            deleteInvitedUser({ variables: { invitedUserID } });
            hidePopup();
          }}
          onDeleteUser={(userID, newOwnerID) => {
            deleteUser({ variables: { userID, newOwnerID } });
            hidePopup();
          }}
          onAddUser={($target) => {
            showPopup(
              $target,
              <Popup tab={0} title="Add member" onClose={() => hidePopup()}>
                <AddUserPopup
                  onAddUser={(u, setError) => {
                    const { roleCode, ...userData } = u;
                    createUser({
                      variables: { ...userData, roleCode: roleCode.value },
                    })
                      .then(() => hidePopup())
                      .catch((e) => {
                        setError('email', { type: 'validate', message: e.message });
                      });
                  }}
                />
              </Popup>,
            );
          }}
        />
      </>
    );
  }
  return <GlobalTopNavbar projectID={null} onSaveProjectName={NOOP} name={null} />;
};

export default AdminRoute;
