import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';

import Lists from 'shared/components/Lists';
import { Board } from './Styles';

type KanbanBoardProps = {
  listsData: BoardState;
  onOpenListActionsPopup: ($targetRef: React.RefObject<HTMLElement>, taskGroupID: string) => void;
  onCardDrop: (task: Task) => void;
  onListDrop: (taskGroup: TaskGroup) => void;
  onCardCreate: (taskGroupID: string, name: string) => void;
  onQuickEditorOpen: (e: ContextMenuEvent) => void;
  onCreateList: (listName: string) => void;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  listsData,
  onOpenListActionsPopup,
  onQuickEditorOpen,
  onCardCreate,
  onCardDrop,
  onListDrop,
  onCreateList,
}) => {
  const match = useRouteMatch();
  const history = useHistory();
  return (
    <Board>
      <Lists
        onCardClick={task => {
          history.push(`${match.url}/c/${task.taskID}`);
        }}
        onExtraMenuOpen={(taskGroupID, $targetRef) => {
          onOpenListActionsPopup($targetRef, taskGroupID);
        }}
        onQuickEditorOpen={onQuickEditorOpen}
        onCardCreate={onCardCreate}
        onCardDrop={onCardDrop}
        onListDrop={onListDrop}
        {...listsData}
        onCreateList={onCreateList}
      />
    </Board>
  );
};

export default KanbanBoard;
