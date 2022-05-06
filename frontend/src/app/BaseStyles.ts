import { createGlobalStyle } from 'styled-components';

import { font, mixin } from 'shared/utils/styles';

export default createGlobalStyle`
  html, body, #root {
    height: 100%;
    min-height: 100%;
  }

  body {
    color: ${(props) => props.theme.colors.text.primary};
    line-height: 1.2;
    font-size: 14px;
    ${font.regular}
  }

  #root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background: ${(props) => props.theme.colors.bg.secondary};
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    ${font.regular}
  }

  *, *:after, *:before, input[type="search"] {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  ul, li, ol, dd, h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6, strong {
    ${font.bold}
  }

  button {
    background: none;
    border: none;
  }

  /* Workaround for IE11 focus highlighting for select elements */
  select::-ms-value {
    background: none;
    color: #42413d;
  }

  [role="button"], button, input, select, textarea {
    outline: none;
    &:focus {
      outline: none;
    }
    &:disabled {
      opacity: 0.5;
    }
  }
  [role="button"], button, input, textarea {
    appearance: none;
  }
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }
  select::-ms-expand {
    display: none;
  }

  p {
    line-height: 1.4285;
  }

  textarea {
    line-height: 1.4285;
  }

  body, select {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    touch-action: manipulation;
  }

  textarea {
    resize: none;
  }

   ::-webkit-scrollbar {
    width: 10px;
  }

   ::-webkit-scrollbar-track {
    background: #262c49;
    border-radius: 20px;
  }

   ::-webkit-scrollbar-thumb {
    background: #7367f0;
    border-radius: 20px;
  }

  .picker-hidden {
    display: none;
  }
`;
