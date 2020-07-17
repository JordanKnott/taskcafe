import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Checkmark } from 'shared/icons';

import {
  LabelSearch,
  ActiveIcon,
  Labels,
  Label,
  CardLabel,
  Section,
  SectionTitle,
  LabelIcon,
  CreateLabelButton,
} from './Styles';

type Props = {
  labels?: Array<ProjectLabel>;
  taskLabels?: Array<TaskLabel>;
  onLabelToggle: (labelId: string) => void;
  onLabelEdit: (labelId: string) => void;
  onLabelCreate: () => void;
};

const LabelManager: React.FC<Props> = ({ labels, taskLabels, onLabelToggle, onLabelEdit, onLabelCreate }) => {
  const [currentLabel, setCurrentLabel] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  return (
    <>
      <LabelSearch
        autoFocus
        value={currentSearch}
        variant="alternate"
        width="100%"
        onChange={e => setCurrentSearch(e.currentTarget.value)}
        type="text"
        placeholder="search labels..."
      />
      <Section>
        <SectionTitle>Labels</SectionTitle>
        <Labels>
          {labels &&
            labels
              .filter(
                label =>
                  currentSearch === '' ||
                  (label.name && label.name.toLowerCase().startsWith(currentSearch.toLowerCase())),
              )
              .map(label => (
                <Label key={label.id}>
                  <LabelIcon
                    onClick={() => {
                      onLabelEdit(label.id);
                    }}
                  >
                    <Pencil width={16} height={16} />
                  </LabelIcon>
                  <CardLabel
                    key={label.id}
                    color={label.labelColor.colorHex}
                    active={currentLabel === label.id}
                    onMouseEnter={() => {
                      setCurrentLabel(label.id);
                    }}
                    onClick={() => onLabelToggle(label.id)}
                  >
                    {label.name}
                    {taskLabels && taskLabels.find(t => t.projectLabel.id === label.id) && (
                      <ActiveIcon>
                        <Checkmark width={16} height={16} />
                      </ActiveIcon>
                    )}
                  </CardLabel>
                </Label>
              ))}
        </Labels>
        <CreateLabelButton
          onClick={() => {
            onLabelCreate();
          }}
        >
          Create a new label
        </CreateLabelButton>
      </Section>
    </>
  );
};
export default LabelManager;
