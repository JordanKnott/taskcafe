import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { User, Plus } from 'shared/icons';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const NewUserButton = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
  line-height: 20px;
  padding: 0.75rem;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(115, 103, 240);
  font-size: 14px;

  border-radius: 0.5rem;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  border-color: rgba(115, 103, 240);
  span {
    padding-left: 0.5rem;
  }
`;
const GridTable = styled.div`
  height: 620px;
`;

const RootWrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
`;

const Root = styled.div`
  .ag-theme-material {
    --ag-foreground-color: #c2c6dc;
    --ag-secondary-foreground-color: #c2c6dc;
    --ag-background-color: transparent;
    --ag-header-background-color: transparent;
    --ag-header-foreground-color: #c2c6dc;
    --ag-border-color: #414561;

    --ag-row-hover-color: #262c49;
    --ag-header-cell-hover-background-color: #262c49;
    --ag-checkbox-unchecked-color: #c2c6dc;
    --ag-checkbox-indeterminate-color: rgba(115, 103, 240);
    --ag-selected-row-background-color: #262c49;
    --ag-material-primary-color: rgba(115, 103, 240);
    --ag-material-accent-color: rgba(115, 103, 240);
  }
  .ag-theme-material ::-webkit-scrollbar {
    width: 12px;
  }

  .ag-theme-material ::-webkit-scrollbar-track {
    background: #262c49;
    border-radius: 20px;
  }

  .ag-theme-material ::-webkit-scrollbar-thumb {
    background: #7367f0;
    border-radius: 20px;
  }
  .ag-header-cell-text {
    color: #fff;
    font-weight: 700;
  }
`;

const Header = styled.div`
  border-bottom: 1px solid #e2e2e2;
  flex-direction: row;
  box-sizing: border-box;
  display: flex;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  background: transparent;
  border-bottom-color: #414561;
  color: #fff;

  height: 112px;
  min-height: 112px;
`;

const ActionButtons = () => {
  return <span>Hello!</span>;
};
const data = {
  defaultColDef: {
    resizable: true,
    sortable: true,
  },
  columnDefs: [
    {
      minWidth: 125,
      width: 125,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: 'ID',
      field: 'id',
    },
    { minWidth: 210, headerName: 'Username', editable: true, field: 'username' },
    { minWidth: 225, headerName: 'Email', field: 'email' },
    { minWidth: 200, headerName: 'Name', editable: true, field: 'full_name' },
    { minWidth: 200, headerName: 'Role', editable: true, field: 'role' },
    {
      minWidth: 200,
      headerName: 'Actions',
      cellRenderer: 'actionButtons',
    },
  ],
  frameworkComponents: {
    actionButtons: ActionButtons,
  },
  rowData: [
    { id: '1', full_name: 'Jordan Knott', username: 'jordan', email: 'jordan@jordanthedev.com', role: 'Admin' },
    { id: '2', full_name: 'Jordan Test', username: 'jordantest', email: 'jordan@jordanthedev.com', role: 'Admin' },
    { id: '3', full_name: 'Jordan Other', username: 'alphatest1050', email: 'jordan@jordanthedev.com', role: 'Admin' },
    { id: '5', full_name: 'Jordan French', username: 'other', email: 'jordan@jordanthedev.com', role: 'Admin' },
  ],
};
const ListTable = () => {
  return (
    <Root>
      <div className="ag-theme-material" style={{ height: '296px', width: '100%' }}>
        <AgGridReact
          rowSelection="multiple"
          defaultColDef={data.defaultColDef}
          columnDefs={data.columnDefs}
          rowData={data.rowData}
          frameworkComponents={data.frameworkComponents}
          onFirstDataRendered={params => {
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={params => {
            params.api.sizeColumnsToFit();
          }}
        ></AgGridReact>
      </div>
    </Root>
  );
};

const Wrapper = styled.div`
  background: #eff2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Container = styled.div`
  padding: 2.2rem;
  display: flex;
  width: 100%;
  position: relative;
`;

const TabNav = styled.div`
  float: left;
  width: 220px;
  height: 100%;
  display: block;
  position: relative;
`;

const TabNavContent = styled.ul`
  display: block;
  width: auto;
  border-bottom: 0 !important;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
`;

const TabNavItem = styled.li`
  padding: 0.35rem 0.3rem;
  display: block;
  position: relative;
`;
const TabNavItemButton = styled.button<{ active: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;

  padding-top: 10px !important;
  padding-bottom: 10px !important;
  padding-left: 12px !important;
  padding-right: 8px !important;
  width: 100%;
  position: relative;

  color: ${props => (props.active ? 'rgba(115, 103, 240)' : '#c2c6dc')};
  &:hover {
    color: rgba(115, 103, 240);
  }
  &:hover svg {
    fill: rgba(115, 103, 240);
  }
`;

const TabNavItemSpan = styled.span`
  text-align: left;
  padding-left: 9px;
  font-size: 14px;
`;

const TabNavLine = styled.span<{ top: number }>`
  left: auto;
  right: 0;
  width: 2px;
  height: 48px;
  transform: scaleX(1);
  top: ${props => props.top}px;

  background: linear-gradient(30deg, rgba(115, 103, 240), rgba(115, 103, 240));
  box-shadow: 0 0 8px 0 rgba(115, 103, 240);
  display: block;
  position: absolute;
  transition: all 0.2s ease;
`;

const TabContentWrapper = styled.div`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
`;

const TabContent = styled.div`
  position: relative;
  width: 100%;
  display: block;
  padding: 0;
  padding: 1.5rem;
  background-color: #10163a;
  margin-left: 1rem !important;
  border-radius: 0.5rem;
`;

const items = [
  { name: 'Insights' },
  { name: 'Members' },
  { name: 'Teams' },
  { name: 'Security' },
  { name: 'Settings' },
];

type NavItemProps = {
  active: boolean;
  name: string;
  tab: number;
  onClick: (tab: number, top: number) => void;
};
const NavItem: React.FC<NavItemProps> = ({ active, name, tab, onClick }) => {
  const $item = useRef<HTMLLIElement>(null);
  return (
    <TabNavItem
      key={name}
      ref={$item}
      onClick={() => {
        if ($item && $item.current) {
          const pos = $item.current.getBoundingClientRect();
          onClick(tab, pos.top);
        }
      }}
    >
      <TabNavItemButton active={active}>
        <User size={14} color={active ? 'rgba(115, 103, 240)' : '#c2c6dc'} />
        <TabNavItemSpan>{name}</TabNavItemSpan>
      </TabNavItemButton>
    </TabNavItem>
  );
};

const Admin = () => {
  const [currentTop, setTop] = useState(0);
  const [currentTab, setTab] = useState(0);
  const $tabNav = useRef<HTMLDivElement>(null);
  return (
    <Container>
      <TabNav ref={$tabNav}>
        <TabNavContent>
          {items.map((item, idx) => (
            <NavItem
              onClick={(tab, top) => {
                if ($tabNav && $tabNav.current) {
                  const pos = $tabNav.current.getBoundingClientRect();
                  setTab(tab);
                  setTop(top - pos.top);
                }
              }}
              name={item.name}
              tab={idx}
              active={idx === currentTab}
            />
          ))}
          <TabNavLine top={currentTop} />
        </TabNavContent>
      </TabNav>
      <TabContentWrapper>
        <TabContent>
          <NewUserButton>
            <Plus color="rgba(115, 103, 240)" size={10} />
            <span>Add New</span>
          </NewUserButton>
          <ListTable />
        </TabContent>
      </TabContentWrapper>
    </Container>
  );
};

export default Admin;
