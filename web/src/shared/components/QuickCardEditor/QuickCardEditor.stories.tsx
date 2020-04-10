import React, { createRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import LabelColors from 'shared/constants/labelColors';
import List, { ListCards } from 'shared/components/List';
import QuickCardEditor from 'shared/components/QuickCardEditor';

export default {
  component: QuickCardEditor,
  title: 'QuickCardEditor',
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

export const Default = () => {
  const $cardRef: any = createRef();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  return (
    <>
      {isEditorOpen && (
        <QuickCardEditor
          isOpen={isEditorOpen}
          listId="1"
          cardId="1"
          cardTitle="Hello, world"
          onCloseEditor={() => setEditorOpen(false)}
          onEditCard={action('edit card')}
          onOpenPopup={action('open popup')}
          onArchiveCard={action('archive card')}
          labels={labelData}
          top={top}
          left={left}
        />
      )}
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
            cardId="1"
            listId="1"
            description="hello!"
            ref={$cardRef}
            title="Hello, world"
            onClick={action('on click')}
            onContextMenu={e => {
              setTop(e.top);
              setLeft(e.left);
              setEditorOpen(true);
            }}
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
    </>
  );
};
