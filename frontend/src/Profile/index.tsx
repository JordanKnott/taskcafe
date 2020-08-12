import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import { Link } from 'react-router-dom';
import { getAccessToken } from 'shared/utils/accessToken';
import Settings from 'shared/components/Settings';
import { useMeQuery, useClearProfileAvatarMutation, useUpdateUserPasswordMutation } from 'shared/generated/graphql';
import axios from 'axios';
import { useCurrentUser } from 'App/context';

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  height: 100%;
  background: #262c49;
`;

const Projects = () => {
  const $fileUpload = useRef<HTMLInputElement>(null);
  const [clearProfileAvatar] = useClearProfileAvatarMutation();
  const { user } = useCurrentUser();
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
        onChange={e => {
          if (e.target.files) {
            console.log(e.target.files[0]);
            const fileData = new FormData();
            fileData.append('file', e.target.files[0]);
            const accessToken = getAccessToken();
            axios
              .post('/users/me/avatar', fileData, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then(res => {
                if ($fileUpload && $fileUpload.current) {
                  $fileUpload.current.value = '';
                  refetch();
                }
              });
          }
        }}
      />
      <GlobalTopNavbar projectID={null} onSaveProjectName={() => {}} name={null} />
      {!loading && data && (
        <Settings
          profile={data.me.user}
          onProfileAvatarChange={() => {
            if ($fileUpload && $fileUpload.current) {
              $fileUpload.current.click();
            }
          }}
          onResetPassword={(password, done) => {
            updateUserPassword({ variables: { userID: user.id, password } });
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
