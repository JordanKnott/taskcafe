import { createGlobalStyle, DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  borderRadius: {
    primary: '3px',
    alternate: '6px',
  },
  colors: {
    primary: '115, 103, 240',
    secondary: '216, 93, 216',
    alternate: '65, 69, 97',
    success: '40, 199, 111',
    danger: '234, 84, 85',
    warning: '255, 159, 67',
    dark: '30, 30, 30',
    text: {
      primary: '194, 198, 220',
      secondary: '255, 255, 255',
    },
    bg: {
      primary: '16, 22, 58',
      secondary: '38, 44, 73',
    },
  },
};

export { theme };

export default createGlobalStyle`
  :root {
    --color-text: #c2c6dc;
    --color-text-hover: #fff;
    --color-primary: rgba(115, 103, 240);
    --color-button-text: #c2c6dc;
    --color-button-text-hover: #fff;
    --color-button-background: rgba(115, 103, 240);

    --color-background: #262c49;
    --color-background-dark: #10163a;

    --color-input-text: #c2c6dc;
    --color-input-text-focus: #fff;

    --color-icon: #c2c6dc;
    --color-active-icon: rgba(115, 103, 240);
  }
`;
