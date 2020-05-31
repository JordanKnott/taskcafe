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
  const $fieldName = useRef<HTMLInputElement>(null);
  const [currentLabel, setCurrentLabel] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  useEffect(() => {
    if ($fieldName.current) {
      $fieldName.current.focus();
    }
  }, []);
  return (
    <>
      <LabelSearch
        type="text"
        ref={$fieldName}
        placeholder="search labels..."
        onChange={e => {
          setCurrentSearch(e.currentTarget.value);
        }}
        value={currentSearch}
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
                    <Pencil color="#c2c6dc" />
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
                        <Checkmark color="#fff" />
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
