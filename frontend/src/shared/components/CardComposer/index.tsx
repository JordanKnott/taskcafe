import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { Cross } from 'shared/icons';

import {
  CardComposerWrapper,
  CancelIconWrapper,
  AddCardButton,
  ComposerControls,
  ComposerControlsSaveSection,
  ComposerControlsActionsSection,
} from './Styles';
import Card from '../Card';

type Props = {
  isOpen: boolean;
  onCreateCard: (cardName: string) => void;
  onClose: () => void;
};

const CardComposer = ({ isOpen, onCreateCard, onClose }: Props) => {
  const [cardName, setCardName] = useState('');
  const $cardRef = useRef<HTMLDivElement>(null);
  useOnOutsideClick($cardRef, true, onClose, null);
  useOnEscapeKeyDown(isOpen, onClose);
  useEffect(() => {
    if ($cardRef.current) {
      $cardRef.current.scrollIntoView();
    }
  });
  return (
    <CardComposerWrapper isOpen={isOpen} ref={$cardRef}>
      <Card
        title={cardName}
        taskID=""
        taskGroupID=""
        editable
        onEditCard={(_taskGroupID, _taskID, name) => {
          if (cardName.trim() !== '') {
            onCreateCard(name.trim());
            setCardName('');
          }
        }}
        onCardTitleChange={name => {
          setCardName(name);
        }}
      />
      <ComposerControls>
        <ComposerControlsSaveSection>
          <AddCardButton
            variant="relief"
            onClick={() => {
              if (cardName.trim() !== '') {
                onCreateCard(cardName.trim());
                setCardName('');
              }
            }}
          >
            Add Card
          </AddCardButton>
          <CancelIconWrapper onClick={() => onClose()}>
            <Cross width={12} height={12} />
          </CancelIconWrapper>
        </ComposerControlsSaveSection>
        <ComposerControlsActionsSection />
      </ComposerControls>
    </CardComposerWrapper>
  );
};

CardComposer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onCreateCard: PropTypes.func.isRequired,
};
CardComposer.defaultProps = {
  isOpen: true,
};

export default CardComposer;
