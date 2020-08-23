import React, { createRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import LabelColors from 'shared/constants/labelColors';
import List, { ListCards } from 'shared/components/List';
import QuickCardEditor from 'shared/components/QuickCardEditor';
import NOOP from 'shared/utils/noop';

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

const labelData: Array<TaskLabel> = [
  {
    id: 'development',
    assignedDate: new Date().toString(),
    projectLabel: {
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
  },
];

export const Default = () => {
  const $cardRef: any = createRef();
  const task: Task = {
    id: 'task',
    name: 'Hello, world!',
    position: 1,
    labels: labelData,
    taskGroup: {
      id: '1',
    },
  };
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [target, setTarget] = useState<null | React.RefObject<HTMLElement>>(null);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  return (
    <>
      {isEditorOpen && target && (
        <QuickCardEditor
          task={task}
          onCloseEditor={() => setEditorOpen(false)}
          onEditCard={action('edit card')}
          onOpenLabelsPopup={action('open popup')}
          onOpenDueDatePopup={action('open popup')}
          onOpenMembersPopup={action('open popup')}
          onToggleComplete={action('complete')}
          onArchiveCard={action('archive card')}
          target={target}
        />
      )}
      <List
        id="1"
        name="General"
        isComposerOpen={false}
        onSaveName={action('on save name')}
        onOpenComposer={action('on open composer')}
        onExtraMenuOpen={NOOP}
      >
        <ListCards>
          <Card
            taskID="1"
            taskGroupID="1"
            description="hello!"
            ref={$cardRef}
            title={task.name}
            onClick={action('on click')}
            onContextMenu={() => {
              setTarget($cardRef);
              setEditorOpen(true);
            }}
            watched
            labels={labelData.map(l => l.projectLabel)}
            checklists={{ complete: 1, total: 4 }}
            dueDate={{ isPastDue: false, formattedDate: 'Oct 26, 2020' }}
          />
          <CardComposer onClose={NOOP} onCreateCard={NOOP} isOpen={false} />
        </ListCards>
      </List>
    </>
  );
};
