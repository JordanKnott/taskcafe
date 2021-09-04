import React, { useRef, useState, useEffect } from 'react';
import { Home, Star, Bell, AngleDown, BarChart, CheckCircle, ListUnordered } from 'shared/icons';
import { Link } from 'react-router-dom';
import { RoleCode } from 'shared/generated/graphql';
import * as S from './Styles';

export type MenuItem = {
  name: string;
  link: string;
};

type NavBarProps = {
  menuType?: Array<MenuItem> | null;
  name: string | null;
  match: string;
};

const NavBar: React.FC<NavBarProps> = ({ menuType, name, match }) => {
  return (
    <S.NavbarWrapper>
      <S.NavbarHeader>
        <S.ProjectActions>
          <S.ProjectSwitch>
            <S.ProjectSwitchInner>
              <S.TaskcafeLogo innerColor="#9f46e4" outerColor="#000" width={32} height={32} />
            </S.ProjectSwitchInner>
          </S.ProjectSwitch>
          <S.ProjectInfo>
            <S.ProjectMeta>{name && <S.ProjectName>{name}</S.ProjectName>}</S.ProjectMeta>
            {name && (
              <S.ProjectTabs>
                {menuType &&
                  menuType.map((menu, idx) => {
                    return (
                      <S.ProjectTab
                        key={menu.name}
                        to={menu.link}
                        exact
                        onClick={() => {
                          // TODO
                        }}
                      >
                        {menu.name}
                      </S.ProjectTab>
                    );
                  })}
              </S.ProjectTabs>
            )}
          </S.ProjectInfo>
        </S.ProjectActions>
        <S.LogoContainer to="/">
          <S.TaskcafeTitle>Taskcafé</S.TaskcafeTitle>
        </S.LogoContainer>
        <S.GlobalActions>
          <Link
            to={{
              pathname: '/login',
              state: { redirect: match },
            }}
          >
            <S.SignIn>Sign In</S.SignIn>
          </Link>
        </S.GlobalActions>
      </S.NavbarHeader>
    </S.NavbarWrapper>
  );
};

export default NavBar;
