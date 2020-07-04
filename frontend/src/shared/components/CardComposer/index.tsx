import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';

import {
  CardComposerWrapper,
  CancelIcon,
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
  return (
    <CardComposerWrapper isOpen={isOpen}>
      <Card
        title={cardName}
        ref={$cardRef}
        taskID=""
        taskGroupID=""
        editable
        onEditCard={(_taskGroupID, _taskID, name) => {
          onCreateCard(name);
          setCardName('');
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
              onCreateCard(cardName);
              setCardName('');
            }}
          >
            Add Card
          </AddCardButton>
          <CancelIcon onClick={onClose} icon={faTimes} color="#42526e" />
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
