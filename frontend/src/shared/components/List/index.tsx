import React, { useState, useRef } from 'react';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';
import { Plus, Ellipsis } from 'shared/icons';

import {
  Container,
  Wrapper,
  Header,
  HeaderName,
  HeaderEditTarget,
  AddCardContainer,
  AddCardButton,
  AddCardButtonText,
  ListCards,
  ListExtraMenuButtonWrapper,
} from './Styles';

type Props = {
  children: React.ReactNode;
  id: string;
  name: string;
  onSaveName: (name: string) => void;
  isComposerOpen: boolean;
  onOpenComposer: (id: string) => void;
  wrapperProps?: any;
  headerProps?: any;
  index?: number;
  onExtraMenuOpen: (taskGroupID: string, $targetRef: React.RefObject<HTMLElement>) => void;
};

const List = React.forwardRef(
  (
    {
      id,
      name,
      onSaveName,
      isComposerOpen,
      onOpenComposer,
      children,
      wrapperProps,
      headerProps,
      onExtraMenuOpen,
    }: Props,
    $wrapperRef: any,
  ) => {
    const [listName, setListName] = useState(name);
    const [isEditingTitle, setEditingTitle] = useState(false);
    const $listNameRef = useRef<HTMLTextAreaElement>(null);
    const $extraActionsRef = useRef<HTMLDivElement>(null);

    const onClick = () => {
      setEditingTitle(true);
      if ($listNameRef && $listNameRef.current) {
        $listNameRef.current.select();
      }
    };
    const onBlur = () => {
      setEditingTitle(false);
      onSaveName(listName);
    };
    const onEscape = () => {
      if ($listNameRef && $listNameRef.current) {
        $listNameRef.current.blur();
      }
    };
    const onChange = (event: React.FormEvent<HTMLTextAreaElement>): void => {
      setListName(event.currentTarget.value);
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if ($listNameRef && $listNameRef.current) {
          $listNameRef.current.blur();
        }
      }
    };

    const handleExtraMenuOpen = () => {
      if ($extraActionsRef && $extraActionsRef.current) {
        onExtraMenuOpen(id, $extraActionsRef);
      }
    };
    useOnEscapeKeyDown(isEditingTitle, onEscape);

    return (
      <Container ref={$wrapperRef} {...wrapperProps}>
        <Wrapper>
          <Header {...headerProps} isEditing={isEditingTitle}>
            <HeaderEditTarget onClick={onClick} isHidden={isEditingTitle} />
            <HeaderName
              ref={$listNameRef}
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              spellCheck={false}
              value={listName}
            />
            <ListExtraMenuButtonWrapper ref={$extraActionsRef} onClick={handleExtraMenuOpen}>
              <Ellipsis size={16} color="#c2c6dc" />
            </ListExtraMenuButtonWrapper>
          </Header>
          {children && children}
          <AddCardContainer hidden={isComposerOpen}>
            <AddCardButton onClick={() => onOpenComposer(id)}>
              <Plus width={12} height={12} />
              <AddCardButtonText>Add another card</AddCardButtonText>
            </AddCardButton>
          </AddCardContainer>
        </Wrapper>
      </Container>
    );
  },
);

List.defaultProps = {
  children: null,
  isComposerOpen: false,
  wrapperProps: {},
  headerProps: {},
};

List.displayName = 'List';
export default List;

export { ListCards };
