import React from 'react';
import { ListActionsWrapper, ListActionItemWrapper, ListActionItem, ListSeparator } from './Styles';

type Props = {
  taskGroupID: string;
};
const LabelManager = ({ taskGroupID }: Props) => {
  return (
    <>
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
        <ListActionItemWrapper>
          <ListActionItem>Archive This List</ListActionItem>
        </ListActionItemWrapper>
      </ListActionsWrapper>
    </>
  );
};
export default LabelManager;
