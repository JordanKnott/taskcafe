import React, { useRef, createContext, RefObject, useState, useContext } from 'react';
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
  show: (target: RefObject<HTMLElement>, content: JSX.Element) => void;
  setTab: (newTab: number) => void;
  getCurrentTab: () => number;
};

type PopupProps = {
  title: string | null;
  onClose: () => void;
  tab: number;
};

type PopupContainerProps = {
  top: number;
  left: number;
  invert: boolean;
  onClose: () => void;
};

const PopupContainer: React.FC<PopupContainerProps> = ({ top, left, onClose, children, invert }) => {
  const $containerRef = useRef();
  useOnOutsideClick($containerRef, true, onClose, null);
  return (
    <Container left={left} top={top} ref={$containerRef} invert={invert}>
      {children}
    </Container>
  );
};
const PopupContext = createContext<PopupContextState>({
  show: () => {},
  setTab: () => {},
  getCurrentTab: () => 0,
});

export const usePopup = () => {
  const ctx = useContext<PopupContextState>(PopupContext);
  return { showPopup: ctx.show, setTab: ctx.setTab, getCurrentTab: ctx.getCurrentTab };
};

type PopupState = {
  isOpen: boolean;
  left: number;
  top: number;
  invert: boolean;
  currentTab: number;
  previousTab: number;
  content: JSX.Element | null;
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
  const show = (target: RefObject<HTMLElement>, content: JSX.Element) => {
    console.log(target);
    if (target && target.current) {
      const bounds = target.current.getBoundingClientRect();
      if (bounds.left + 304 + 30 > window.innerWidth) {
        console.log('open!');
        setState({
          isOpen: true,
          left: bounds.left + bounds.width,
          top: bounds.top + bounds.height,
          invert: true,
          currentTab: 0,
          previousTab: 0,
          content,
        });
      } else {
        console.log('open NOT INVERT!');
        setState({
          isOpen: true,
          left: bounds.left,
          top: bounds.top + bounds.height,
          invert: false,
          currentTab: 0,
          previousTab: 0,
          content,
        });
      }
    }
  };
  const portalTarget = canUseDOM ? document.body : null; // appease flow

  const setTab = (newTab: number) => {
    setState((prevState: PopupState) => {
      return {
        ...prevState,
        previousTab: currentState.currentTab,
        currentTab: newTab,
      };
    });
  };

  const getCurrentTab = () => {
    return currentState.currentTab;
  };

  return (
    <Provider value={{ show, setTab, getCurrentTab }}>
      {portalTarget &&
        currentState.isOpen &&
        createPortal(
          <PopupContainer
            invert={currentState.invert}
            top={currentState.top}
            left={currentState.left}
            onClose={() => setState(defaultState)}
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
};

const PopupMenu: React.FC<Props> = ({ title, top, left, onClose, noHeader, children, onPrevious }) => {
  const $containerRef = useRef();
  useOnOutsideClick($containerRef, true, onClose, null);

  return (
    <Container invert={false} left={left} top={top} ref={$containerRef}>
      <Wrapper>
        {onPrevious && (
          <PreviousButton onClick={onPrevious}>
            <AngleLeft color="#c2c6dc" />
          </PreviousButton>
        )}
        {noHeader ? (
          <CloseButton onClick={() => onClose()}>
            <Cross color="#c2c6dc" />
          </CloseButton>
        ) : (
          <Header>
            <HeaderTitle>{title}</HeaderTitle>
            <CloseButton onClick={() => onClose()}>
              <Cross color="#c2c6dc" />
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
        <CloseButton onClick={() => onClose()}>
          <Cross color="#c2c6dc" />
        </CloseButton>
        <Content>{children}</Content>
      </Wrapper>
    </>
  );
};

export default PopupMenu;
