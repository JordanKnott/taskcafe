import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';

import Lists from 'shared/components/Lists';
import { Board } from './Styles';

type KanbanBoardProps = {
  onOpenListActionsPopup: ($targetRef: React.RefObject<HTMLElement>, taskGroupID: string) => void;
  onCardDrop: (task: Task) => void;
  onListDrop: (taskGroup: TaskGroup) => void;
  onCardCreate: (taskGroupID: string, name: string) => void;
  onQuickEditorOpen: (e: ContextMenuEvent) => void;
  onCreateList: (listName: string) => void;
  onCardMemberClick: OnCardMemberClick;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onOpenListActionsPopup,
  onQuickEditorOpen,
  onCardCreate,
  onCardDrop,
  onListDrop,
  onCreateList,
  onCardMemberClick,
}) => {
  const match = useRouteMatch();
  const history = useHistory();
  return <Board></Board>;
};

export default KanbanBoard;
