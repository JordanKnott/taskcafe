import React, { useState } from 'react';
import LabelColors from 'shared/constants/labelColors';
import { Checkmark } from 'shared/icons';
import { SaveButton, DeleteButton, LabelBox, EditLabelForm, FieldLabel, FieldName } from './Styles';

type Props = {
  labelColors: Array<LabelColor>;
  label: Label | null;
  onLabelEdit: (labelId: string | null, labelName: string, labelColor: LabelColor) => void;
};

const LabelManager = ({ labelColors, label, onLabelEdit }: Props) => {
  console.log(label);
  const [currentLabel, setCurrentLabel] = useState(label ? label.name : '');
  const [currentColor, setCurrentColor] = useState<LabelColor | null>(label ? label.labelColor : null);
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
        {labelColors.map((labelColor: LabelColor) => (
          <LabelBox
            color={labelColor.colorHex}
            onClick={() => {
              setCurrentColor(labelColor);
            }}
          >
            {currentColor && labelColor.id === currentColor.id && <Checkmark color="#fff" size={12} />}
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
