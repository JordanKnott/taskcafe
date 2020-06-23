import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import Modal from 'shared/components/Modal';
import TaskDetails from '.';

export default {
  component: TaskDetails,
  title: 'TaskDetails',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#cdd3e1', default: true },
    ],
  },
};

export const Default = () => {
  const [description, setDescription] = useState('');
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Modal
        width={1040}
        onClose={action('on close')}
        renderContent={() => {
          return (
            <TaskDetails
              onDeleteItem={action('delete item')}
              onChangeItemName={action('change item name')}
              task={{
                id: '1',
                taskGroup: { name: 'General', id: '1' },
                name: 'Hello, world',
                position: 1,
                labels: [
                  {
                    id: 'soft-skills',
                    assignedDate: new Date().toString(),
                    projectLabel: {
                      createdDate: new Date().toString(),
                      id: 'label-soft-skills',
                      name: 'Soft Skills',
                      labelColor: {
                        id: '1',
                        name: 'white',
                        colorHex: '#fff',
                        position: 1,
                      },
                    },
                  },
                ],
                description,
                assigned: [
                  {
                    id: '1',
                    profileIcon: { bgColor: null, url: null, initials: null },
                    fullName: 'Jordan Knott',
                  },
                ],
              }}
              onTaskNameChange={action('task name change')}
              onTaskDescriptionChange={(_task, desc) => setDescription(desc)}
              onDeleteTask={action('delete task')}
              onCloseModal={action('close modal')}
              onMemberProfile={action('profile')}
              onOpenAddMemberPopup={action('open add member popup')}
              onAddItem={action('add item')}
              onToggleTaskComplete={action('toggle task complete')}
              onToggleChecklistItem={action('toggle checklist item')}
              onOpenAddLabelPopup={action('open add label popup')}
              onChangeChecklistName={action('change checklist name')}
              onDeleteChecklist={action('delete checklist')}
              onOpenAddChecklistPopup={action(' open checklist')}
              onOpenDueDatePopop={action('open due date popup')}
            />
          );
        }}
      />
    </>
  );
};
