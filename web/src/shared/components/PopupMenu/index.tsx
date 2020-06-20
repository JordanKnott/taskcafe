import React, { useRef, createContext, RefObject, useState, useContext, useEffect } from 'react';
import { Cross, AngleLeft } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { createPortal } from 'react-dom';
import produce from 'immer';
import {
  Container,
  ContainerDiamond,
  Header,
  HeaderTitle,
  Content,
  CloseButton,
  PreviousButton,
  Wrapper,
} from './Styles';

type PopupContextState = {
  show: (target: RefObject<HTMLElement>, content: JSX.Element, width?: string | number) => void;
  setTab: (newTab: number, width?: number | string) => void;
  getCurrentTab: () => number;
  hide: () => void;
};

type PopupProps = {
  title: string | null;
  onClose?: () => void;
  tab: number;
};

type PopupContainerProps = {
  top: number;
  left: number;
  invert: boolean;
  onClose: () => void;
  width?: string | number;
};

const PopupContainer: React.FC<PopupContainerProps> = ({ width, top, left, onClose, children, invert }) => {
  const $containerRef = useRef<HTMLDivElement>(null);
  const [currentTop, setCurrentTop] = useState(top);
  useOnOutsideClick($containerRef, true, onClose, null);
  useEffect(() => {
    if ($containerRef && $containerRef.current) {
      const bounding = $containerRef.current.getBoundingClientRect();
      if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
        setCurrentTop(44);
      }
    }
  }, []);
  return (
    <Container width={width ?? 316} left={left} top={currentTop} ref={$containerRef} invert={invert}>
      {children}
    </Container>
  );
};

PopupContainer.defaultProps = {
  width: 316,
};

const PopupContext = createContext<PopupContextState>({
  show: () => {},
  setTab: () => {},
  getCurrentTab: () => 0,
  hide: () => {},
});

export const usePopup = () => {
  const ctx = useContext<PopupContextState>(PopupContext);
  return { showPopup: ctx.show, setTab: ctx.setTab, getCurrentTab: ctx.getCurrentTab, hidePopup: ctx.hide };
};

type PopupState = {
  isOpen: boolean;
  left: number;
  top: number;
  invert: boolean;
  currentTab: number;
  previousTab: number;
  content: JSX.Element | null;
  width?: string | number;
};

const { Provider, Consumer } = PopupContext;

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

const defaultState = {
  isOpen: false,
  left: 0,
  top: 0,
  invert: false,
  currentTab: 0,
  previousTab: 0,
  content: null,
};

export const PopupProvider: React.FC = ({ children }) => {
  const [currentState, setState] = useState<PopupState>(defaultState);
  const show = (target: RefObject<HTMLElement>, content: JSX.Element, width?: number | string) => {
    if (target && target.current) {
      const bounds = target.current.getBoundingClientRect();
      const top = bounds.top + bounds.height;
      if (bounds.left + 304 + 30 > window.innerWidth) {
        setState({
          isOpen: true,
          left: bounds.left + bounds.width,
          top,
          invert: true,
          currentTab: 0,
          previousTab: 0,
          content,
          width: width ?? 316,
        });
      } else {
        setState({
          isOpen: true,
          left: bounds.left,
          top,
          invert: false,
          currentTab: 0,
          previousTab: 0,
          content,
          width: width ?? 316,
        });
      }
    }
  };
  const hide = () => {
    setState({
      isOpen: false,
      left: 0,
      top: 0,
      invert: true,
      currentTab: 0,
      previousTab: 0,
      content: null,
    });
  };
  const portalTarget = canUseDOM ? document.body : null; // appease flow

  const setTab = (newTab: number, width?: number | string) => {
    let newWidth = width ?? currentState.width;
    setState((prevState: PopupState) => {
      return {
        ...prevState,
        previousTab: currentState.currentTab,
        currentTab: newTab,
        width: newWidth,
      };
    });
  };

  const getCurrentTab = () => {
    return currentState.currentTab;
  };

  return (
    <Provider value={{ hide, show, setTab, getCurrentTab }}>
      {portalTarget &&
        currentState.isOpen &&
        createPortal(
          <PopupContainer
            invert={currentState.invert}
            top={currentState.top}
            left={currentState.left}
            onClose={() => setState(defaultState)}
            width={currentState.width ?? 316}
          >
            {currentState.content}
            <ContainerDiamond invert={currentState.invert} />
          </PopupContainer>,
          portalTarget,
        )}
      {children}
    </Provider>
  );
};

type Props = {
  title: string | null;
  top: number;
  left: number;
  onClose: () => void;
  onPrevious?: () => void | null;
  noHeader?: boolean | null;
  width?: string | number;
};

const PopupMenu: React.FC<Props> = ({ width, title, top, left, onClose, noHeader, children, onPrevious }) => {
  const $containerRef = useRef<HTMLDivElement>(null);
  useOnOutsideClick($containerRef, true, onClose, null);

  return (
    <Container width={width ?? 316} invert={false} left={left} top={top} ref={$containerRef}>
      <Wrapper>
        {onPrevious && (
          <PreviousButton onClick={onPrevious}>
            <AngleLeft color="#c2c6dc" />
          </PreviousButton>
        )}
        {noHeader ? (
          <CloseButton onClick={() => onClose()}>
            <Cross width={16} height={16} />
          </CloseButton>
        ) : (
          <Header>
            <HeaderTitle>{title}</HeaderTitle>
            <CloseButton onClick={() => onClose()}>
              <Cross width={16} height={16} />
            </CloseButton>
          </Header>
        )}
        <Content>{children}</Content>
      </Wrapper>
    </Container>
  );
};

export const Popup: React.FC<PopupProps> = ({ title, onClose, tab, children }) => {
  const { getCurrentTab, setTab } = usePopup();
  if (getCurrentTab() !== tab) {
    return null;
  }

  return (
    <>
      <Wrapper>
        {tab > 0 && (
          <PreviousButton
            onClick={() => {
              setTab(0);
            }}
          >
            <AngleLeft color="#c2c6dc" />
          </PreviousButton>
        )}
        {title && (
          <Header>
            <HeaderTitle>{title}</HeaderTitle>
          </Header>
        )}
        {onClose && (
          <CloseButton onClick={() => onClose()}>
            <Cross width={16} height={16} />
          </CloseButton>
        )}
        <Content>{children}</Content>
      </Wrapper>
    </>
  );
};

export default PopupMenu;
