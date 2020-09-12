import styled from 'styled-components';
import Button from 'shared/components/Button';
import TextareaAutosize from 'react-autosize-textarea';
import { mixin } from 'shared/utils/styles';

export const CancelIconWrapper = styled.div`
  opacity: 0.8;
  cursor: pointer;
  font-size: 1.25em;
  padding-left: 5px;
`;

export const CardComposerWrapper = styled.div<{ isOpen: boolean }>`
  padding-bottom: 8px;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
`;

export const ComposerControls = styled.div``;

export const ComposerControlsSaveSection = styled.div`
  display: flex;
  float: left;
  align-items: center;
  justify-content: center;
`;
export const ComposerControlsActionsSection = styled.div`
  float: right;
`;
export const AddCardButton = styled(Button)`
  margin-right: 4px;
  padding: 6px 12px;
  border-radius: 3px;
`;
