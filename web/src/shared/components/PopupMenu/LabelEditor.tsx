import React, { useState } from 'react';
import LabelColors from 'shared/constants/labelColors';
import { Checkmark } from 'shared/icons';
import { SaveButton, DeleteButton, LabelBox, EditLabelForm, FieldLabel, FieldName } from './Styles';

type Props = {
  label: Label | null;
  onLabelEdit: (labelId: string | null, labelName: string, color: string) => void;
};

const LabelManager = ({ label, onLabelEdit }: Props) => {
  console.log(label);
  const [currentLabel, setCurrentLabel] = useState(label ? label.name : '');
  const [currentColor, setCurrentColor] = useState<string | null>(label ? label.color : null);
  return (
    <EditLabelForm>
      <FieldLabel>Name</FieldLabel>
      <FieldName
        id="labelName"
        type="text"
        name="name"
        onChange={e => {
          setCurrentLabel(e.currentTarget.value);
        }}
        value={currentLabel}
      />
      <FieldLabel>Select a color</FieldLabel>
      <div>
        {Object.values(LabelColors).map(labelColor => (
          <LabelBox
            color={labelColor}
            onClick={() => {
              setCurrentColor(labelColor);
            }}
          >
            {labelColor === currentColor && <Checkmark color="#fff" size={12} />}
          </LabelBox>
        ))}
      </div>
      <div>
        <SaveButton
          onClick={e => {
            e.preventDefault();
            console.log(currentColor);
            if (currentColor) {
              onLabelEdit(label ? label.labelId : null, currentLabel, currentColor);
            }
          }}
          type="submit"
          value="Save"
        />
        <DeleteButton type="submit" value="Delete" />
      </div>
    </EditLabelForm>
  );
};
export default LabelManager;
