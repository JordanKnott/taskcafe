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

const labelData: Array<ProjectLabel> = [
  {
    id: 'development',
    name: 'Development',
    createdDate: 'date',
    labelColor: {
      id: 'label-color-blue',
      colorHex: LabelColors.BLUE,
      name: 'blue',
      position: 1,
    },
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
          taskGroupID="1"
          taskID="1"
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
        onExtraMenuOpen={(taskGroupID, $targetRef) => console.log(taskGroupID, $targetRef)}
      >
        <ListCards>
          <Card
            taskID="1"
            taskGroupID="1"
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
