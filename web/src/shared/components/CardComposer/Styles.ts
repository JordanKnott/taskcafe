import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mixin } from 'shared/utils/styles';

export const CancelIcon = styled(FontAwesomeIcon)`
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

export const ListCard = styled.div`
  background-color: ${props => mixin.lighten('#262c49', 0.05)};
  border-radius: 3px;
  ${mixin.boxShadowCard}
  cursor: pointer;
  display: block;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 20px;
  position: relative;
  text-decoration: none;
  z-index: 0;
`;

export const ListCardDetails = styled.div`
  overflow: hidden;
  padding: 6px 8px 2px;
  position: relative;
  z-index: 10;
`;

export const ListCardLabels = styled.div``;

export const ListCardEditor = styled(TextareaAutosize)`
  font-family: 'Droid Sans';
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
  height: 54px;
  width: 100%;

  background: none;
  border: none;
  box-shadow: none;
  margin-bottom: 4px;
  max-height: 162px;
  min-height: 54px;
  padding: 0;
  font-size: 14px;
  line-height: 20px;

  color: #c2c6dc;
  l &:focus {
    background-color: ${props => mixin.lighten('#262c49', 0.05)};
  }
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

export const AddCardButton = styled.button`
  background-color: #5aac44;
  box-shadow: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  line-height: 20px;
  margin-right: 4px;
  padding: 6px 12px;
  text-align: center;
  border-radius: 3px;
`;
