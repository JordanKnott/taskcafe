import React, { createRef } from 'react';
import { action } from '@storybook/addon-actions';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import LabelColors from 'shared/constants/labelColors';
import List, { ListCards } from './index';

export default {
  component: List,
  title: 'List',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};

const labelData = [
  {
    labelId: 'development',
    name: 'Development',
    color: LabelColors.BLUE,
    active: false,
  },
  {
    labelId: 'general',
    name: 'General',
    color: LabelColors.PINK,
    active: false,
  },
];

const createCard = () => {
  const $ref = createRef<HTMLDivElement>();
  return (
    <Card
      taskID="1"
      taskGroupID="1"
      description="hello!"
      ref={$ref}
      title="Hello, world"
      onClick={action('on click')}
      onContextMenu={action('on context click')}
      watched
      labels={labelData}
      checklists={{ complete: 1, total: 4 }}
      dueDate={{ isPastDue: false, formattedDate: 'Oct 26, 2020' }}
    />
  );
};

export const Default = () => {
  return (
    <List
      id=""
      name="General"
      isComposerOpen={false}
      onSaveName={action('on save name')}
      onOpenComposer={action('on open composer')}
      tasks={[]}
    >
      <ListCards>
        <CardComposer
          onClose={() => {
            console.log('close!');
          }}
          onCreateCard={name => {
            console.log(name);
          }}
          isOpen={false}
        />
      </ListCards>
    </List>
  );
};

export const WithCardComposer = () => {
  return (
    <List
      id="1"
      name="General"
      isComposerOpen
      onSaveName={action('on save name')}
      onOpenComposer={action('on open composer')}
      tasks={[]}
    >
      <ListCards>
        <CardComposer
          onClose={() => {
            console.log('close!');
          }}
          onCreateCard={name => {
            console.log(name);
          }}
          isOpen
        />
      </ListCards>
    </List>
  );
};

export const WithCard = () => {
  const $cardRef: any = createRef();
  return (
    <List
      id="1"
      name="General"
      isComposerOpen={false}
      onSaveName={action('on save name')}
      onOpenComposer={action('on open composer')}
      tasks={[]}
    >
      <ListCards>
        <Card
          taskID="1"
          taskGroupID="1"
          description="hello!"
          ref={$cardRef}
          title="Hello, world"
          onClick={action('on click')}
          onContextMenu={action('on context click')}
          watched
          labels={labelData}
          checklists={{ complete: 1, total: 4 }}
          dueDate={{ isPastDue: false, formattedDate: 'Oct 26, 2020' }}
        />
        <CardComposer
          onClose={() => {
            console.log('close!');
          }}
          onCreateCard={name => {
            console.log(name);
          }}
          isOpen={false}
        />
      </ListCards>
    </List>
  );
};
export const WithCardAndComposer = () => {
  const $cardRef: any = createRef();
  return (
    <List
      id="1"
      name="General"
      isComposerOpen
      onSaveName={action('on save name')}
      onOpenComposer={action('on open composer')}
      tasks={[]}
    >
      <ListCards>
        <Card
          taskID="1"
          taskGroupID="1"
          description="hello!"
          ref={$cardRef}
          title="Hello, world"
          onClick={action('on click')}
          onContextMenu={action('on context click')}
          watched
          labels={labelData}
          checklists={{ complete: 1, total: 4 }}
          dueDate={{ isPastDue: false, formattedDate: 'Oct 26, 2020' }}
        />
        <CardComposer
          onClose={() => {
            console.log('close!');
          }}
          onCreateCard={name => {
            console.log(name);
          }}
          isOpen
        />
      </ListCards>
    </List>
  );
};
