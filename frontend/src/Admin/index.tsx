import React, { useEffect, useState } from 'react';
import Admin from 'shared/components/Admin';
import Select from 'shared/components/Select';
import GlobalTopNavbar from 'App/TopNavbar';
import {
    useUsersQuery,
    useDeleteUserAccountMutation,
    useCreateUserAccountMutation,
    UsersDocument,
    UsersQuery,
} from 'shared/generated/graphql';
import Input from 'shared/components/Input';
import styled from 'styled-components';
import Button from 'shared/components/Button';
import { useForm } from 'react-hook-form';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import produce from 'immer';
import updateApolloCache from 'shared/utils/cache';

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
type CreateUserData = {
    email: string;
    username: string;
    fullName: string;
    initials: string;
    password: string;
    roleCode: string;
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
    const { register, handleSubmit, errors, setValue } = useForm<CreateUserData>();
    const [role, setRole] = useState<string | null>(null);
    register({ name: 'roleCode' }, { required: true });

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
            <Select
                label="Role"
                value={role}
                options={[
                    { label: 'Admin', value: 'admin' },
                    { label: 'Member', value: 'member' },
                ]}
                onChange={newRole => {
                    setRole(newRole);
                    setValue('roleCode', newRole.value);
                }}
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
    const [deleteUser] = useDeleteUserAccountMutation({
        update: (client, response) => {
            updateApolloCache<UsersQuery>(client, UsersDocument, cache =>
                produce(cache, draftCache => {
                    draftCache.users = cache.users.filter(u => u.id !== response.data.deleteUserAccount.userAccount.id);
                }),
            );
        },
    });
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
        return <GlobalTopNavbar projectID={null} onSaveProjectName={() => { }} name={null} />;
    }
    if (data) {
        return (
            <>
                <GlobalTopNavbar projectID={null} onSaveProjectName={() => { }} name={null} />
                <Admin
                    initialTab={1}
                    users={data.users}
                    onInviteUser={() => { }}
                    onUpdateUserPassword={(user, password) => {
                        console.log(user)
                        console.log(password)
                        hidePopup()
                    }}
                    onDeleteUser={($target, userID) => {
                        showPopup(
                            $target,
                            <Popup tab={0} title="Delete user?" onClose={() => hidePopup()}>
                                <DeleteUserPopup
                                    onDeleteUser={() => {
                                        deleteUser({ variables: { userID } });
                                        hidePopup();
                                    }}
                                />
                            </Popup>,
                        );
                    }}
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
