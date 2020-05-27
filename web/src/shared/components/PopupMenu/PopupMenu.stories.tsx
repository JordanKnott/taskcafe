import React, { useState, useRef, createRef } from 'react';
import { action } from '@storybook/addon-actions';
import LabelColors from 'shared/constants/labelColors';
import LabelManager from 'shared/components/PopupMenu/LabelManager';
import LabelEditor from 'shared/components/PopupMenu/LabelEditor';
import ListActions from 'shared/components/ListActions';
import MemberManager from 'shared/components/MemberManager';
import DueDateManager from 'shared/components/DueDateManager';
import MiniProfile from 'shared/components/MiniProfile';
import styled from 'styled-components';

import PopupMenu, { PopupProvider, usePopup, Popup } from '.';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import produce from 'immer';

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
    labelColor: {
      id: '1',
      name: 'white',
      colorHex: LabelColors.BLUE,
      position: 1,
    },
    active: false,
  },
  {
    labelId: 'general',
    name: 'General',
    labelColor: {
      id: '1',
      name: 'white',
      colorHex: LabelColors.PINK,
      position: 1,
    },
    active: false,
  },
];

const OpenLabelBtn = styled.span``;

type TabProps = {
  tab: number;
};

const LabelManagerEditor = () => {
  const [labels, setLabels] = useState(labelData);
  const [currentLabel, setCurrentLabel] = useState('');
  const { setTab } = usePopup();
  return (
    <>
      <Popup title="Labels" tab={0} onClose={action('on close')}>
        <LabelManager
          labels={labels}
          onLabelCreate={() => {
            setTab(2);
          }}
          onLabelEdit={labelId => {
            setCurrentLabel(labelId);
            setTab(1);
          }}
          onLabelToggle={labelId => {
            setLabels(
              produce(labels, draftState => {
                const idx = labels.findIndex(label => label.labelId === labelId);
                if (idx !== -1) {
                  draftState[idx] = { ...draftState[idx], active: !labels[idx].active };
                }
              }),
            );
          }}
        />
      </Popup>
      <Popup onClose={action('on close')} title="Edit label" tab={1}>
        <LabelEditor
          labelColors={[{ id: '1', colorHex: '#c2c6dc', position: 1, name: 'gray' }]}
          label={labels.find(label => label.labelId === currentLabel) ?? null}
          onLabelEdit={(_labelId, name, color) => {
            setLabels(
              produce(labels, draftState => {
                const idx = labels.findIndex(label => label.labelId === currentLabel);
                if (idx !== -1) {
                  draftState[idx] = { ...draftState[idx], name, labelColor: color };
                }
              }),
            );
            setTab(0);
          }}
        />
      </Popup>
      <Popup onClose={action('on close')} title="Create new label" tab={2}>
        <LabelEditor
          label={null}
          labelColors={[{ id: '1', colorHex: '#c2c6dc', position: 1, name: 'gray' }]}
          onLabelEdit={(_labelId, name, color) => {
            setLabels([...labels, { labelId: name, name, labelColor: color, active: false }]);
            setTab(0);
          }}
        />
      </Popup>
    </>
  );
};

const OpenLabelsButton = () => {
  const $buttonRef = createRef<HTMLButtonElement>();
  const [currentLabel, setCurrentLabel] = useState('');
  const [labels, setLabels] = useState(labelData);
  const { showPopup, setTab } = usePopup();
  console.log(labels);
  return (
    <OpenLabelBtn
      ref={$buttonRef}
      onClick={() => {
        showPopup($buttonRef, <LabelManagerEditor />);
      }}
    >
      Open
    </OpenLabelBtn>
  );
};

export const LabelsPopup = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  return (
    <PopupProvider>
      <OpenLabelsButton />
    </PopupProvider>
  );
};

export const LabelsLabelEditor = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  return (
    <>
      {isPopupOpen && (
        <PopupMenu
          onPrevious={action('on previous')}
          title="Change Label"
          top={10}
          onClose={() => setPopupOpen(false)}
          left={10}
        >
          <LabelEditor
            label={labelData[0]}
            onLabelEdit={action('label edit')}
            labelColors={[{ id: '1', colorHex: '#c2c6dc', position: 1, name: 'gray' }]}
          />
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

export const MemberManagerPopup = () => {
  const $buttonRef = useRef<HTMLButtonElement>(null);
  const [popupData, setPopupData] = useState(initalState);
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      {popupData.isOpen && (
        <PopupMenu title="Members" top={popupData.top} onClose={() => setPopupData(initalState)} left={popupData.left}>
          <MemberManager
            availableMembers={[
              { userID: '1', displayName: 'Jordan Knott', profileIcon: { bgColor: null, url: null, initials: null } },
            ]}
            activeMembers={[]}
            onMemberChange={action('member change')}
          />
        </PopupMenu>
      )}
      <span
        ref={$buttonRef}
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
      </span>
    </>
  );
};

export const DueDateManagerPopup = () => {
  const $buttonRef = useRef<HTMLButtonElement>(null);
  const [popupData, setPopupData] = useState(initalState);
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      {popupData.isOpen && (
        <PopupMenu title="Due Date" top={popupData.top} onClose={() => setPopupData(initalState)} left={popupData.left}>
          <DueDateManager
            task={{
              taskID: '1',
              taskGroup: { name: 'General', taskGroupID: '1' },
              name: 'Hello, world',
              position: 1,
              labels: [
                {
                  labelId: 'soft-skills',
                  labelColor: {
                    id: '1',
                    name: 'white',
                    colorHex: '#fff',
                    position: 1,
                  },
                  active: true,
                  name: 'Soft Skills',
                },
              ],
              description: 'hello!',
              members: [
                { userID: '1', profileIcon: { bgColor: null, url: null, initials: null }, displayName: 'Jordan Knott' },
              ],
            }}
            onCancel={action('cancel')}
            onDueDateChange={action('due date change')}
          />
        </PopupMenu>
      )}
      <span
        style={{
          width: '60px',
          textAlign: 'center',
          margin: '25px auto',
          cursor: 'pointer',
        }}
        ref={$buttonRef}
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
      </span>
    </>
  );
};

export const MiniProfilePopup = () => {
  const $buttonRef = useRef<HTMLButtonElement>(null);
  const [popupData, setPopupData] = useState(initalState);
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      {popupData.isOpen && (
        <PopupMenu
          noHeader
          title="Due Date"
          top={popupData.top}
          onClose={() => setPopupData(initalState)}
          left={popupData.left}
        >
          <MiniProfile
            displayName="Jordan Knott"
            profileIcon={{ url: null, bgColor: '#000', initials: 'JK' }}
            username="@jordanthedev"
            bio="Stuff and things"
            onRemoveFromTask={action('mini profile')}
          />
        </PopupMenu>
      )}
      <span
        style={{
          width: '60px',
          textAlign: 'center',
          margin: '25px auto',
          cursor: 'pointer',
          color: '#fff',
          background: '#f00',
        }}
        ref={$buttonRef}
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
      </span>
    </>
  );
};
