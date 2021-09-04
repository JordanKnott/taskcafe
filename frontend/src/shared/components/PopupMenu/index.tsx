import React, { useRef, createContext, RefObject, useState, useContext, useEffect } from 'react';
import { Cross, AngleLeft } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { createPortal } from 'react-dom';
import NOOP from 'shared/utils/noop';
import produce from 'immer';
import theme from 'App/ThemeStyles';
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

function getPopupOptions(options?: PopupOptions) {
  const popupOptions: PopupOptionsInternal = {
    borders: true,
    diamondColor: theme.colors.bg.secondary,
    targetPadding: '10px',
    showDiamond: true,
    width: 316,
  };
  if (options) {
    if (options.borders) {
      popupOptions.borders = options.borders;
    }
    if (options.width) {
      popupOptions.width = options.width;
    }
    if (options.targetPadding) {
      popupOptions.targetPadding = options.targetPadding;
    }
    if (typeof options.showDiamond !== 'undefined' && options.showDiamond !== null) {
      popupOptions.showDiamond = options.showDiamond;
    }
    if (options.diamondColor) {
      popupOptions.diamondColor = options.diamondColor;
    }
    if (options.onClose) {
      popupOptions.onClose = options.onClose;
    }
  }
  return popupOptions;
}

type PopupContextState = {
  show: (target: RefObject<HTMLElement>, content: JSX.Element, options?: PopupOptions) => void;
  setTab: (newTab: number, options?: PopupOptions) => void;
  getCurrentTab: () => number;
  hide: () => void;
};

type PopupProps = {
  title: string | null;
  onClose?: () => void;
  tab: number;
  padding?: boolean;
  borders?: boolean;
  diamondColor?: string;
};

type PopupContainerProps = {
  top: number;
  left: number;
  invert: boolean;
  targetPadding: string;
  invertY: boolean;
  onClose: () => void;
  width?: string | number;
};

const PopupContainer: React.FC<PopupContainerProps> = ({
  width,
  top,
  left,
  onClose,
  children,
  invert,
  invertY,
  targetPadding,
}) => {
  const $containerRef = useRef<HTMLDivElement>(null);
  const [currentTop, setCurrentTop] = useState(top);
  useOnOutsideClick($containerRef, true, onClose, null);
  return (
    <Container
      targetPadding={targetPadding}
      width={width ?? 316}
      left={left}
      top={currentTop}
      ref={$containerRef}
      invert={invert}
      invertY={invertY}
    >
      {children}
    </Container>
  );
};

PopupContainer.defaultProps = {
  width: 316,
};

const PopupContext = createContext<PopupContextState>({
  show: NOOP,
  setTab: NOOP,
  getCurrentTab: () => 0,
  hide: NOOP,
});

export const usePopup = () => {
  const ctx = useContext<PopupContextState>(PopupContext);
  return { showPopup: ctx.show, setTab: ctx.setTab, getCurrentTab: ctx.getCurrentTab, hidePopup: ctx.hide };
};

type PopupState = {
  isOpen: boolean;
  left: number;
  top: number;
  invertY: boolean;
  invert: boolean;
  currentTab: number;
  previousTab: number;
  content: JSX.Element | null;
  options: PopupOptionsInternal | null;
};

const { Provider, Consumer } = PopupContext;

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

type PopupOptionsInternal = {
  width: number;
  borders: boolean;
  targetPadding: string;
  diamondColor: string;
  showDiamond: boolean;
  onClose?: () => void;
};

type PopupOptions = {
  targetPadding?: string | null;
  showDiamond?: boolean | null;
  width?: number | null;
  borders?: boolean | null;
  diamondColor?: string | null;
  onClose?: () => void;
};
const defaultState = {
  isOpen: false,
  left: 0,
  top: 0,
  invert: false,
  invertY: false,
  currentTab: 0,
  previousTab: 0,
  content: null,
  options: null,
};

export const PopupProvider: React.FC = ({ children }) => {
  const [currentState, setState] = useState<PopupState>(defaultState);
  const show = (target: RefObject<HTMLElement>, content: JSX.Element, options?: PopupOptions) => {
    if (target && target.current) {
      const bounds = target.current.getBoundingClientRect();
      let top = bounds.top + bounds.height;
      let invertY = false;
      if (window.innerHeight / 2 < top) {
        top = window.innerHeight - bounds.top;
        invertY = true;
      }
      const popupOptions = getPopupOptions(options);
      if (bounds.left + 304 + 30 > window.innerWidth) {
        setState({
          isOpen: true,
          left: bounds.left + bounds.width,
          top,
          invertY,
          invert: true,
          currentTab: 0,
          previousTab: 0,
          content,
          options: popupOptions,
        });
      } else {
        setState({
          isOpen: true,
          left: bounds.left,
          top,
          invert: false,
          invertY,
          currentTab: 0,
          previousTab: 0,
          content,
          options: popupOptions,
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
      invertY: false,
      currentTab: 0,
      previousTab: 0,
      content: null,
      options: null,
    });
  };
  const portalTarget = canUseDOM ? document.body : null; // appease flow

  const setTab = (newTab: number, options?: PopupOptions) => {
    setState((prevState: PopupState) =>
      produce(prevState, (draftState) => {
        draftState.previousTab = currentState.currentTab;
        draftState.currentTab = newTab;
        if (options) {
          draftState.options = getPopupOptions(options);
        }
      }),
    );
  };

  const getCurrentTab = () => {
    return currentState.currentTab;
  };

  return (
    <Provider value={{ hide, show, setTab, getCurrentTab }}>
      {portalTarget &&
        currentState.isOpen &&
        currentState.options &&
        createPortal(
          <PopupContainer
            invertY={currentState.invertY}
            invert={currentState.invert}
            top={currentState.top}
            targetPadding={currentState.options.targetPadding}
            left={currentState.left}
            onClose={() => {
              if (currentState.options && currentState.options.onClose) {
                currentState.options.onClose();
              }
              setState(defaultState);
            }}
            width={currentState.options.width}
          >
            {currentState.content}
            {currentState.options.showDiamond && (
              <ContainerDiamond
                color={currentState.options.diamondColor}
                borders={currentState.options.borders}
                invertY={currentState.invertY}
                invert={currentState.invert}
              />
            )}
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
    <Container
      targetPadding="10px"
      invertY={false}
      width={width ?? 316}
      invert={false}
      left={left}
      top={top}
      ref={$containerRef}
    >
      <Wrapper padding borders>
        {onPrevious && (
          <PreviousButton onClick={onPrevious}>
            <AngleLeft size={16} color="#c2c6dc" />
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

export const Popup: React.FC<PopupProps> = ({ borders = true, padding = true, title, onClose, tab, children }) => {
  const { getCurrentTab, setTab } = usePopup();
  if (getCurrentTab() !== tab) {
    return null;
  }

  return (
    <>
      <Wrapper borders={borders} padding={padding}>
        {tab > 0 && (
          <PreviousButton
            onClick={() => {
              setTab(0);
            }}
          >
            <AngleLeft size={16} color="#c2c6dc" />
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
