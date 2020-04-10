import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import LabelColors from 'shared/constants/labelColors';
import MenuTypes from 'shared/constants/menuTypes';
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
        <PopupMenu
          title="Label"
          menuType={MenuTypes.LABEL_MANAGER}
          top={10}
          onClose={() => setPopupOpen(false)}
          left={10}
          onLabelEdit={action('label edit')}
          onLabelToggle={action('label toggle')}
          labels={labelData}
        />
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
        <PopupMenu
          title="Change Label"
          menuType={MenuTypes.LABEL_EDITOR}
          top={10}
          onClose={() => setPopupOpen(false)}
          left={10}
          onLabelEdit={action('label edit')}
          onLabelToggle={action('label toggle')}
          labels={labelData}
        />
      )}
      <button type="submit" onClick={() => setPopupOpen(true)}>
        Open
      </button>
    </>
  );
};
