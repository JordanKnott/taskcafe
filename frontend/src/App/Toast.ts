import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

const ToastedContainer = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 10px;
    background: #7367f0;
    color: #fff;
  }
  .Toastify__toast--error {
    background: ${props => props.theme.colors.danger};
  }
  .Toastify__toast--warning {
    background: ${props => props.theme.colors.warning};
  }
  .Toastify__toast--success {
    background: ${props => props.theme.colors.success};
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
  }
  .Toastify__close-button {
    display: none;
  }
`;

export default ToastedContainer;
