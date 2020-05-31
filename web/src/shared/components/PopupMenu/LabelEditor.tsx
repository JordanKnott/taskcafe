import React, { useState, useEffect, useRef } from 'react';
import LabelColors from 'shared/constants/labelColors';
import { Checkmark } from 'shared/icons';
import { SaveButton, DeleteButton, LabelBox, EditLabelForm, FieldLabel, FieldName } from './Styles';

type Props = {
  labelColors: Array<LabelColor>;
  label: ProjectLabel | null;
  onLabelEdit: (labelId: string | null, labelName: string, labelColor: LabelColor) => void;
  onLabelDelete?: (labelId: string) => void;
};

const LabelManager = ({ labelColors, label, onLabelEdit, onLabelDelete }: Props) => {
  const $fieldName = useRef<HTMLInputElement>(null);
  const [currentLabel, setCurrentLabel] = useState(label ? label.name : '');
  const [currentColor, setCurrentColor] = useState<LabelColor | null>(label ? label.labelColor : null);

  useEffect(() => {
    if ($fieldName.current) {
      $fieldName.current.focus();
    }
  }, []);

  return (
    <EditLabelForm>
      <FieldLabel>Name</FieldLabel>
      <FieldName
        ref={$fieldName}
        id="labelName"
        type="text"
        name="name"
        onChange={e => {
          setCurrentLabel(e.currentTarget.value);
        }}
        value={currentLabel ?? ''}
      />
      <FieldLabel>Select a color</FieldLabel>
      <div>
        {labelColors.map((labelColor: LabelColor) => (
          <LabelBox
            key={labelColor.id}
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
          value="Save"
          type="submit"
          onClick={e => {
            e.preventDefault();
            console.log(currentColor);
            if (currentColor) {
              onLabelEdit(label ? label.id : null, currentLabel ?? '', currentColor);
            }
          }}
        />
        {label && onLabelDelete && (
          <DeleteButton
            value="Delete"
            type="submit"
            onClick={e => {
              e.preventDefault();
              onLabelDelete(label.id);
            }}
          />
        )}
      </div>
    </EditLabelForm>
  );
};
export default LabelManager;
