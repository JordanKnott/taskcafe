import React, { useState, useRef } from 'react';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
} from './Styles';

type Props = {
  children: React.ReactNode;
  id: string;
  name: string;
  onSaveName: (name: string) => void;
  isComposerOpen: boolean;
  onOpenComposer: (id: string) => void;
  tasks: Task[];
  wrapperProps?: any;
  headerProps?: any;
  index?: number;
};

const List = React.forwardRef(
  (
    { id, name, onSaveName, isComposerOpen, onOpenComposer, children, wrapperProps, headerProps }: Props,
    $wrapperRef: any,
  ) => {
    const [listName, setListName] = useState(name);
    const [isEditingTitle, setEditingTitle] = useState(false);
    const $listNameRef: any = useRef<HTMLTextAreaElement>();

    const onClick = () => {
      setEditingTitle(true);
      if ($listNameRef) {
        $listNameRef.current.select();
      }
    };
    const onBlur = () => {
      setEditingTitle(false);
      onSaveName(listName);
    };
    const onEscape = () => {
      $listNameRef.current.blur();
    };
    const onChange = (event: React.FormEvent<HTMLTextAreaElement>): void => {
      setListName(event.currentTarget.value);
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $listNameRef.current.blur();
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
          </Header>
          {children && children}
          <AddCardContainer hidden={isComposerOpen}>
            <AddCardButton onClick={() => onOpenComposer(id)}>
              <FontAwesomeIcon icon={faPlus} size="xs" color="#42526e" />
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
