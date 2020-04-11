import React, { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import LabelColors from 'shared/constants/labelColors';
import LabelManager from 'shared/components/PopupMenu/LabelManager';
import LabelEditor from 'shared/components/PopupMenu/LabelEditor';
import ListActions from 'shared/components/ListActions';

import PopupMenu from '.';

export default {
  component: PopupMenu,
  title: 'PopupMenu',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};
const labelData = [
  {
    labelId: 'development',
    name: 'Development',
    color: LabelColors.BLUE,
    active: true,
  },
  {
    labelId: 'general',
    name: 'General',
    color: LabelColors.PINK,
    active: false,
  },
];

export const LabelsPopup = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  return (
    <>
      {isPopupOpen && (
        <PopupMenu title="Label" top={10} onClose={() => setPopupOpen(false)} left={10}>
          <LabelManager labels={labelData} onLabelToggle={action('label toggle')} onLabelEdit={action('label edit')} />
        </PopupMenu>
      )}
      <button type="submit" onClick={() => setPopupOpen(true)}>
        Open
      </button>
    </>
  );
};

export const LabelsLabelEditor = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  return (
    <>
      {isPopupOpen && (
        <PopupMenu title="Change Label" top={10} onClose={() => setPopupOpen(false)} left={10}>
          <LabelEditor label={labelData[0]} onLabelEdit={action('label edit')} />
        </PopupMenu>
      )}
      <button type="submit" onClick={() => setPopupOpen(true)}>
        Open
      </button>
    </>
  );
};
const initalState = { left: 0, top: 0, isOpen: false };

export const ListActionsPopup = () => {
  const $buttonRef = useRef<HTMLButtonElement>(null);
  const [popupData, setPopupData] = useState(initalState);
  return (
    <>
      {popupData.isOpen && (
        <PopupMenu
          title="List Actions"
          top={popupData.top}
          onClose={() => setPopupData(initalState)}
          left={popupData.left}
        >
          <ListActions taskGroupID="1" onArchiveTaskGroup={action('archive task group')} />
        </PopupMenu>
      )}
      <button
        ref={$buttonRef}
        type="submit"
        onClick={() => {
          if ($buttonRef && $buttonRef.current) {
            const pos = $buttonRef.current.getBoundingClientRect();
            setPopupData({
              isOpen: true,
              left: pos.left,
              top: pos.top + pos.height + 10,
            });
          }
        }}
      >
        Open
      </button>
    </>
  );
};
