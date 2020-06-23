import React, { useEffect } from 'react';
import Admin from 'shared/components/Admin';
import GlobalTopNavbar from 'App/TopNavbar';
import { useUsersQuery, useCreateUserAccountMutation, UsersDocument } from 'shared/generated/graphql';
import Input from 'shared/components/Input';
import styled from 'styled-components';
import Button from 'shared/components/Button';
import { useForm } from 'react-hook-form';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import produce from 'immer';

type CreateUserData = {
  email: string;
  username: string;
  fullName: string;
  initials: string;
  password: string;
};
const CreateUserForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const CreateUserButton = styled(Button)`
  margin-top: 8px;
  padding: 6px 12px;
  width: 100%;
`;

const AddUserInput = styled(Input)`
  margin-bottom: 8px;
`;

const InputError = styled.span`
  color: rgba(${props => props.theme.colors.danger});
  font-size: 12px;
`;
type AddUserPopupProps = {
  onAddUser: (user: CreateUserData) => void;
};
const AddUserPopup: React.FC<AddUserPopupProps> = ({ onAddUser }) => {
  const { register, handleSubmit, errors } = useForm<CreateUserData>();
  const createUser = (data: CreateUserData) => {
    onAddUser(data);
  };
  return (
    <CreateUserForm onSubmit={handleSubmit(createUser)}>
      <AddUserInput
        floatingLabel
        width="100%"
        label="Full Name"
        id="fullName"
        name="fullName"
        variant="alternate"
        ref={register({ required: 'Full name is required' })}
      />
      {errors.fullName && <InputError>{errors.fullName.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Email"
        id="email"
        name="email"
        variant="alternate"
        ref={register({ required: 'Email is required' })}
      />
      {errors.email && <InputError>{errors.email.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Username"
        id="username"
        name="username"
        variant="alternate"
        ref={register({ required: 'Username is required' })}
      />
      {errors.username && <InputError>{errors.username.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Initials"
        id="initials"
        name="initials"
        variant="alternate"
        ref={register({ required: 'Initials is required' })}
      />
      {errors.initials && <InputError>{errors.initials.message}</InputError>}
      <AddUserInput
        floatingLabel
        width="100%"
        label="Password"
        id="password"
        name="password"
        variant="alternate"
        ref={register({ required: 'Password is required' })}
      />
      {errors.password && <InputError>{errors.password.message}</InputError>}
      <CreateUserButton type="submit">Create</CreateUserButton>
    </CreateUserForm>
  );
};

const AdminRoute = () => {
  useEffect(() => {
    document.title = 'Citadel | Admin';
  }, []);
  const { loading, data } = useUsersQuery();
  const { showPopup, hidePopup } = usePopup();
  const [createUser] = useCreateUserAccountMutation({
    update: (client, createData) => {
      const cacheData: any = client.readQuery({
        query: UsersDocument,
      });
      console.log(cacheData);
      console.log(createData);
      const newData = produce(cacheData, (draftState: any) => {
        draftState.users = [...draftState.users, { ...createData.data.createUserAccount }];
      });

      client.writeQuery({
        query: UsersDocument,
        data: {
          ...newData,
        },
      });
    },
  });
  if (loading) {
    return <GlobalTopNavbar projectID={null} onSaveProjectName={() => {}} name={null} />;
  }
  if (data) {
    return (
      <>
        <GlobalTopNavbar projectID={null} onSaveProjectName={() => {}} name={null} />
        <Admin
          initialTab={1}
          users={data.users.map((user: any) => ({ ...user, role: 'TBD' }))}
          onInviteUser={() => {}}
          onAddUser={$target => {
            showPopup(
              $target,
              <Popup tab={0} title="Add member" onClose={() => hidePopup()}>
                <AddUserPopup
                  onAddUser={user => {
                    createUser({ variables: { ...user } });
                    hidePopup();
                  }}
                />
              </Popup>,
            );
          }}
        />
      </>
    );
  }
  return <span>error</span>;
};

export default AdminRoute;
