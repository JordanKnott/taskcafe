import React from 'react';
import { InnerContent, ListActionsWrapper, ListActionItemWrapper, ListActionItem, ListSeparator } from './Styles';

type Props = {
  taskGroupID: string;

  onArchiveTaskGroup: (taskGroupID: string) => void;
};
const LabelManager: React.FC<Props> = ({ taskGroupID, onArchiveTaskGroup }) => {
  return (
    <InnerContent>
      <ListActionsWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Add card...</ListActionItem>
        </ListActionItemWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Copy List...</ListActionItem>
        </ListActionItemWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Move card...</ListActionItem>
        </ListActionItemWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Watch</ListActionItem>
        </ListActionItemWrapper>
      </ListActionsWrapper>
      <ListSeparator />
      <ListActionsWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Sort By...</ListActionItem>
        </ListActionItemWrapper>
      </ListActionsWrapper>
      <ListSeparator />
      <ListActionsWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Move All Cards in This List...</ListActionItem>
        </ListActionItemWrapper>
        <ListActionItemWrapper>
          <ListActionItem>Archive All Cards in This List...</ListActionItem>
        </ListActionItemWrapper>
      </ListActionsWrapper>
      <ListSeparator />
      <ListActionsWrapper>
        <ListActionItemWrapper onClick={() => onArchiveTaskGroup(taskGroupID)}>
          <ListActionItem>Archive This List</ListActionItem>
        </ListActionItemWrapper>
      </ListActionsWrapper>
    </InnerContent>
  );
};
export default LabelManager;
