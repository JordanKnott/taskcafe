import React, { useState } from 'react';
import { Pencil, Checkmark } from 'shared/icons';

import { LabelSearch, ActiveIcon, Labels, Label, CardLabel, Section, SectionTitle, LabelIcon } from './Styles';

type Props = {
  labels?: Label[];
  onLabelToggle: (labelId: string) => void;
  onLabelEdit: (labelId: string, labelName: string, color: string) => void;
};
const LabelManager: React.FC<Props> = ({ labels, onLabelToggle, onLabelEdit }) => {
  const [currentLabel, setCurrentLabel] = useState('');
  return (
    <>
      <LabelSearch type="text" />
      <Section>
        <SectionTitle>Labels</SectionTitle>
        <Labels>
          {labels &&
            labels.map(label => (
              <Label>
                <LabelIcon>
                  <Pencil />
                </LabelIcon>
                <CardLabel
                  key={label.labelId}
                  color={label.color}
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
      </Section>
    </>
  );
};
export default LabelManager;
