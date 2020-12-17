import styled from 'styled-components/macro';
import TextareaAutosize from 'react-autosize-textarea';

const Textarea = styled(TextareaAutosize)`
  border: none;
  resize: none;
  overflow: hidden;
  overflow-wrap: break-word;
  background: transparent;
  border-radius: 3px;
  box-shadow: none;
  margin: -4px 0;

  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  flex-direction: column;
  text-align: start;

  color: #c2c6dc;
  font-weight: 600;
  font-size: 20px;
  padding: 3px 10px 3px 8px;
  &:focus {
    box-shadow: ${props => props.theme.colors.primary} 0px 0px 0px 1px;
  }
`;

export default Textarea;
