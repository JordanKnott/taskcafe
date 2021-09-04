import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import Settings from 'shared/components/Settings';
import {
  useMeQuery,
  useClearProfileAvatarMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserInfoMutation,
  MeQuery,
  MeDocument,
} from 'shared/generated/graphql';
import axios from 'axios';
import { useCurrentUser } from 'App/context';
import NOOP from 'shared/utils/noop';
import { toast } from 'react-toastify';
import updateApolloCache from 'shared/utils/cache';
import produce from 'immer';

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  height: 100%;
  background: #262c49;
`;

const Projects = () => {
  const $fileUpload = useRef<HTMLInputElement>(null);
  const [clearProfileAvatar] = useClearProfileAvatarMutation();
  const { user } = useCurrentUser();
  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const { loading, data, refetch } = useMeQuery();
  useEffect(() => {
    document.title = 'Profile | Taskcafé';
  }, []);
  if (!user) {
    return null;
  }

  return (
    <>
      <input
        type="file"
        name="file"
        style={{ display: 'none' }}
        ref={$fileUpload}
        onChange={(e) => {
          if (e.target.files) {
            const fileData = new FormData();
            fileData.append('file', e.target.files[0]);
            axios
              .post('/users/me/avatar', fileData, {
                withCredentials: true,
              })
              .then((res) => {
                if ($fileUpload && $fileUpload.current) {
                  $fileUpload.current.value = '';
                  refetch();
                }
              });
          }
        }}
      />
      <GlobalTopNavbar projectID={null} onSaveProjectName={NOOP} name={null} />
      {!loading && data && data.me && (
        <Settings
          profile={data.me.user}
          onProfileAvatarChange={() => {
            if ($fileUpload && $fileUpload.current) {
              $fileUpload.current.click();
            }
          }}
          onResetPassword={(password, done) => {
            updateUserPassword({ variables: { userID: user, password } });
            toast('Password was changed!');
            done();
          }}
          onChangeUserInfo={(d, done) => {
            updateUserInfo({
              variables: { name: d.fullName, bio: d.bio, email: d.email, initials: d.initials },
            });
            toast('User info was saved!');
            done();
          }}
          onProfileAvatarRemove={() => {
            clearProfileAvatar();
          }}
        />
      )}
    </>
  );
};

export default Projects;
