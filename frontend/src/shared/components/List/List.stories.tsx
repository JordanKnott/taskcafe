import React, { createRef } from 'react';
import { action } from '@storybook/addon-actions';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import LabelColors from 'shared/constants/labelColors';
import NOOP from 'shared/utils/noop';
import List, { ListCards } from '.';

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
      onExtraMenuOpen={action('extra menu open')}
    >
      <ListCards>
        <CardComposer onClose={NOOP} onCreateCard={NOOP} isOpen={false} />
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
      onExtraMenuOpen={action('extra menu open')}
    >
      <ListCards>
        <CardComposer onClose={NOOP} onCreateCard={NOOP} isOpen />
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
      onExtraMenuOpen={action('extra menu open')}
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
        <CardComposer onClose={NOOP} onCreateCard={NOOP} isOpen={false} />
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
      onExtraMenuOpen={action('extra menu open')}
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
        <CardComposer onClose={NOOP} onCreateCard={NOOP} isOpen />
      </ListCards>
    </List>
  );
};
