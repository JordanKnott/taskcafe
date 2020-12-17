import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import BaseStyles from 'App/BaseStyles';
import NormalizeStyles from 'App/NormalizeStyles';
import theme from 'App/ThemeStyles';
import produce from 'immer';
import styled, { ThemeProvider } from 'styled-components';
import NOOP from 'shared/utils/noop';
import Checklist, { ChecklistItem } from '.';

export default {
  component: Checklist,
  title: 'Checklist',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#f8f8f8', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

const Container = styled.div`
  width: 552px;
  margin: 25px;
  border: 1px solid ${props => props.theme.colors.bg.primary};
`;

const defaultItems = [
  {
    id: '1',
    position: 1,
    taskChecklistID: '1',
    complete: false,
    name: 'Tasks',
    assigned: null,
    dueDate: null,
  },
  {
    id: '2',
    taskChecklistID: '1',
    position: 2,
    complete: false,
    name: 'Projects',
    assigned: null,
    dueDate: null,
  },
  {
    id: '3',
    position: 3,
    taskChecklistID: '1',
    complete: false,
    name: 'Teams',
    assigned: null,
    dueDate: null,
  },
  {
    id: '4',
    position: 4,
    complete: false,
    taskChecklistID: '1',
    name: 'Organizations',
    assigned: null,
    dueDate: null,
  },
];

export const Default = () => {
  const [checklistName, setChecklistName] = useState('Checklist');
  const [items, setItems] = useState(defaultItems);
  const onToggleItem = (itemID: string, complete: boolean) => {
    setItems(
      produce(items, draftState => {
        const idx = items.findIndex(item => item.id === itemID);
        if (idx !== -1) {
          draftState[idx] = {
            ...draftState[idx],
            complete,
          };
        }
      }),
    );
  };
  return (
    <>
      <BaseStyles />
      <NormalizeStyles />
      <ThemeProvider theme={theme}>
        <Container>
          <Checklist
            wrapperProps={{}}
            handleProps={{}}
            name={checklistName}
            checklistID="checklist-one"
            items={items}
            onDeleteChecklist={action('delete checklist')}
            onChangeName={currentName => {
              setChecklistName(currentName);
            }}
            onAddItem={itemName => {
              let position = 1;
              const lastItem = items[-1];
              if (lastItem) {
                position = lastItem.position * 2 + 1;
              }
              setItems([
                ...items,
                {
                  id: `${Math.random()}`,
                  name: itemName,
                  complete: false,
                  assigned: null,
                  dueDate: null,
                  position,
                  taskChecklistID: '1',
                },
              ]);
            }}
            onDeleteItem={itemID => {
              setItems(items.filter(item => item.id !== itemID));
            }}
            onChangeItemName={(itemID, currentName) => {
              setItems(
                produce(items, draftState => {
                  const idx = items.findIndex(item => item.id === itemID);
                  if (idx !== -1) {
                    draftState[idx] = {
                      ...draftState[idx],
                      name: currentName,
                    };
                  }
                }),
              );
            }}
            onToggleItem={onToggleItem}
          >
            {items.map(item => (
              <ChecklistItem
                key={item.id}
                wrapperProps={{}}
                handleProps={{}}
                checklistID="id"
                itemID={item.id}
                name={item.name}
                complete={item.complete}
                onDeleteItem={NOOP}
                onChangeName={NOOP}
                onToggleItem={NOOP}
              />
            ))}
          </Checklist>
        </Container>
      </ThemeProvider>
    </>
  );
};
