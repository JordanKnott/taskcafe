import React, { useState } from 'react';
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
  labels?: Label[];
  onLabelToggle: (labelId: string) => void;
  onLabelEdit: (labelId: string) => void;
  onLabelCreate: () => void;
};
const LabelManager: React.FC<Props> = ({ labels, onLabelToggle, onLabelEdit, onLabelCreate }) => {
  const [currentLabel, setCurrentLabel] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  return (
    <>
      <LabelSearch
        type="text"
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
              .filter(label => currentSearch === '' || label.name.toLowerCase().startsWith(currentSearch.toLowerCase()))
              .map(label => (
                <Label key={label.labelId}>
                  <LabelIcon
                    onClick={() => {
                      onLabelEdit(label.labelId);
                    }}
                  >
                    <Pencil color="#c2c6dc" />
                  </LabelIcon>
                  <CardLabel
                    key={label.labelId}
                    color={label.labelColor.colorHex}
                    active={currentLabel === label.labelId}
                    onMouseEnter={() => {
                      setCurrentLabel(label.labelId);
                    }}
                    onClick={() => onLabelToggle(label.labelId)}
                  >
                    {label.name}
                    {label.active && (
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
