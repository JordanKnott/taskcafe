import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';
import useWindowSize from 'shared/hooks/useWindowSize';
import styled from 'styled-components';
import { Cross } from 'shared/icons';
import { ScrollOverlay, ClickableOverlay, StyledModal } from './Styles';

const $root: HTMLElement = document.getElementById('root')!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

type ModalProps = {
  width: number;
  onClose: () => void;
  renderContent: () => JSX.Element;
};

function getAdjustedHeight(height: number) {
  if (height >= 900) {
    return height - 150;
  }
  if (height >= 800) {
    return height - 125;
  }
  return height - 70;
}

const CloseIcon = styled(Cross)`
  position: absolute;
  top: 16px;
  right: -32px;
  cursor: pointer;
  fill: ${props => props.theme.colors.text.primary};
  &:hover {
    fill: ${props => props.theme.colors.text.secondary};
  }
`;

const InnerModal: React.FC<ModalProps> = ({ width, onClose: tellParentToClose, renderContent }) => {
  const $modalRef = useRef<HTMLDivElement>(null);
  const $clickableOverlayRef = useRef<HTMLDivElement>(null);
  const [_width, height] = useWindowSize();

  useOnOutsideClick($modalRef, true, tellParentToClose, $clickableOverlayRef);
  useOnEscapeKeyDown(true, tellParentToClose);

  return (
    <ScrollOverlay>
      <ClickableOverlay ref={$clickableOverlayRef}>
        <StyledModal width={width} height={getAdjustedHeight(height)} ref={$modalRef}>
          {renderContent()}
          <CloseIcon onClick={() => tellParentToClose()} width={20} height={20} />
        </StyledModal>
      </ClickableOverlay>
    </ScrollOverlay>
  );
};

const Modal: React.FC<ModalProps> = ({ width, onClose: tellParentToClose, renderContent }) => {
  return ReactDOM.createPortal(
    <InnerModal width={width} onClose={tellParentToClose} renderContent={renderContent} />,
    $root,
  );
};

export default Modal;
