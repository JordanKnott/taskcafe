import React, { useRef } from 'react';
import { Cross } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import MenuTypes from 'shared/constants/menuTypes';
import LabelColors from 'shared/constants/labelColors';
import LabelManager from './LabelManager';
import LabelEditor from './LabelEditor';
import { Container, Header, HeaderTitle, Content, Label, CloseButton } from './Styles';

type Props = {
  title: string;
  top: number;
  left: number;
  menuType: number;
  labels?: Label[];
  onClose: () => void;

  onLabelToggle: (labelId: string) => void;
  onLabelEdit: (labelId: string, labelName: string, color: string) => void;
};

const PopupMenu = ({ title, menuType, labels, top, left, onClose, onLabelToggle, onLabelEdit }: Props) => {
  const $containerRef = useRef();
  useOnOutsideClick($containerRef, true, onClose, null);

  return (
    <Container left={left} top={top} ref={$containerRef}>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        <CloseButton onClick={() => onClose()}>
          <Cross />
        </CloseButton>
      </Header>
      <Content>
        {menuType === MenuTypes.LABEL_MANAGER && (
          <LabelManager onLabelEdit={onLabelEdit} onLabelToggle={onLabelToggle} labels={labels} />
        )}
        {menuType === MenuTypes.LABEL_EDITOR && (
          <LabelEditor
            onLabelEdit={onLabelEdit}
            label={{ active: false, color: LabelColors.GREEN, name: 'General', labelId: 'general' }}
          />
        )}
      </Content>
    </Container>
  );
};

export default PopupMenu;
