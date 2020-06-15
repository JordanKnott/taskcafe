import React, { useRef } from 'react';
import { action } from '@storybook/addon-actions';
import LabelColors from 'shared/constants/labelColors';
import Card from '.';

export default {
  component: Card,
  title: 'Card',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#f8f8f8', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

const labelData: Array<ProjectLabel> = [
  {
    id: 'development',
    name: 'Development',
    createdDate: new Date().toString(),
    labelColor: {
      id: '1',
      colorHex: LabelColors.BLUE,
      name: 'blue',
      position: 1,
    },
  },
];

export const Default = () => {
  const $ref = useRef<HTMLDivElement>(null);
  return (
    <Card
      taskID="1"
      taskGroupID="1"
      description=""
      ref={$ref}
      title="Hello, world"
      onClick={action('on click')}
      onContextMenu={action('on context click')}
    />
  );
};

export const Labels = () => {
  const $ref = useRef<HTMLDivElement>(null);
  return (
    <Card
      taskID="1"
      taskGroupID="1"
      description=""
      ref={$ref}
      title="Hello, world"
      labels={labelData}
      onClick={action('on click')}
      onContextMenu={action('on context click')}
    />
  );
};

export const Badges = () => {
  const $ref = useRef<HTMLDivElement>(null);
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
      checklists={{ complete: 1, total: 4 }}
      dueDate={{ isPastDue: false, formattedDate: 'Oct 26, 2020' }}
    />
  );
};

export const PastDue = () => {
  const $ref = useRef<HTMLDivElement>(null);
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
      checklists={{ complete: 1, total: 4 }}
      dueDate={{ isPastDue: true, formattedDate: 'Oct 26, 2020' }}
    />
  );
};

export const Everything = () => {
  const $ref = useRef<HTMLDivElement>(null);
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
      members={[
        {
          id: '1',
          fullName: 'Jordan Knott',
          profileIcon: {
            bgColor: '#0079bf',
            initials: 'JK',
            url: null,
          },
        },
      ]}
      labels={labelData}
      checklists={{ complete: 1, total: 4 }}
      dueDate={{ isPastDue: false, formattedDate: 'Oct 26, 2020' }}
    />
  );
};

export const Members = () => {
  const $ref = useRef<HTMLDivElement>(null);
  return (
    <Card
      description={null}
      taskID="1"
      taskGroupID="1"
      ref={$ref}
      title="Hello, world"
      onClick={action('on click')}
      onContextMenu={action('on context click')}
      members={[
        {
          id: '1',
          fullName: 'Jordan Knott',
          profileIcon: {
            bgColor: '#0079bf',
            initials: 'JK',
            url: null,
          },
        },
      ]}
      labels={[]}
    />
  );
};

export const Editable = () => {
  const $ref = useRef<HTMLDivElement>(null);
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
      editable
      onEditCard={action('edit card')}
    />
  );
};
