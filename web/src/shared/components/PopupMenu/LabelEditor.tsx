import React, { useState } from 'react';
import LabelColors from 'shared/constants/labelColors';
import { Checkmark } from 'shared/icons';
import { SaveButton, DeleteButton, LabelBox, EditLabelForm, FieldLabel, FieldName } from './Styles';

type Props = {
  label: Label;
  onLabelEdit: (labelId: string, labelName: string, color: string) => void;
};
const LabelManager = ({ label, onLabelEdit }: Props) => {
  const [currentLabel, setCurrentLabel] = useState('');
  return (
    <EditLabelForm>
      <FieldLabel>Name</FieldLabel>
      <FieldName id="labelName" type="text" name="name" value={currentLabel} />
      <FieldLabel>Select a color</FieldLabel>
      <div>
        {Object.values(LabelColors).map(labelColor => (
          <LabelBox color={labelColor}>
            <Checkmark color="#fff" size={12} />
          </LabelBox>
        ))}
      </div>
      <div>
        <SaveButton type="submit" value="Save" />
        <DeleteButton type="submit" value="Delete" />
      </div>
    </EditLabelForm>
  );
};
export default LabelManager;
