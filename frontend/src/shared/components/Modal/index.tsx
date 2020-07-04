import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import useOnEscapeKeyDown from 'shared/hooks/onEscapeKeyDown';

import { ScrollOverlay, ClickableOverlay, StyledModal } from './Styles';

const $root: HTMLElement = document.getElementById('root')!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

type ModalProps = {
  width: number;
  onClose: () => void;
  renderContent: () => JSX.Element;
};

const Modal: React.FC<ModalProps> = ({ width, onClose: tellParentToClose, renderContent }) => {
  const $modalRef = useRef<HTMLDivElement>(null);
  const $clickableOverlayRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick($modalRef, true, tellParentToClose, $clickableOverlayRef);
  useOnEscapeKeyDown(true, tellParentToClose);

  return ReactDOM.createPortal(
    <ScrollOverlay>
      <ClickableOverlay ref={$clickableOverlayRef}>
        <StyledModal width={width} ref={$modalRef}>
          {renderContent()}
        </StyledModal>
      </ClickableOverlay>
    </ScrollOverlay>,
    $root,
  );
};

export default Modal;
