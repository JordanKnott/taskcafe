import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';

import {
  CardComposerWrapper,
  CancelIcon,
  AddCardButton,
  ListCard,
  ListCardDetails,
  ListCardEditor,
  ComposerControls,
  ComposerControlsSaveSection,
  ComposerControlsActionsSection,
} from './Styles';

type Props = {
  isOpen: boolean;
  onCreateCard: (cardName: string) => void;
  onClose: () => void;
};

const CardComposer = ({ isOpen, onCreateCard, onClose }: Props) => {
  const [cardName, setCardName] = useState('');
  const $cardEditor: any = useRef(null);
  const onClick = () => {
    onCreateCard(cardName);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCreateCard(cardName);
    }
  };
  const onBlur = () => {
    if (cardName === '') {
      onClose();
    } else {
      onCreateCard(cardName);
    }
  };
  useOnEscapeKeyDown(isOpen, onClose);
  useOnOutsideClick($cardEditor, true, () => onClose(), null);
  useEffect(() => {
    $cardEditor.current.focus();
  }, []);
  return (
    <CardComposerWrapper isOpen={isOpen}>
      <ListCard>
        <ListCardDetails>
          <ListCardEditor
            onKeyDown={onKeyDown}
            ref={$cardEditor}
            onChange={e => {
              setCardName(e.currentTarget.value);
            }}
            value={cardName}
            placeholder="Enter a title for this card..."
          />
        </ListCardDetails>
      </ListCard>
      <ComposerControls>
        <ComposerControlsSaveSection>
          <AddCardButton onClick={onClick}>Add Card</AddCardButton>
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
