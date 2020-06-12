import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import { Link } from 'react-router-dom';
import { getAccessToken } from 'shared/utils/accessToken';
import Navbar from 'App/Navbar';
import Settings from 'shared/components/Settings';
import UserIDContext from 'App/context';
import { useMeQuery, useClearProfileAvatarMutation } from 'shared/generated/graphql';
import axios from 'axios';

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  height: 100%;
  background: #262c49;
`;

const Projects = () => {
  const $fileUpload = useRef<HTMLInputElement>(null);
  const [clearProfileAvatar] = useClearProfileAvatarMutation();
  const { loading, data, refetch } = useMeQuery();
  useEffect(() => {
    document.title = 'Profile | Citadel';
  }, []);
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
              .post('http://localhost:3333/users/me/avatar', fileData, {
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
      <GlobalTopNavbar onSaveProjectName={() => {}} name={null} />
      {!loading && data && (
        <Settings
          profile={data.me.profileIcon}
          onProfileAvatarChange={() => {
            if ($fileUpload && $fileUpload.current) {
              $fileUpload.current.click();
            }
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
