import { DefaultTheme } from 'styled-components';
import Color from 'color';

const theme: DefaultTheme = {
  borderRadius: {
    primary: '3x',
    alternate: '6px',
  },
  colors: {
    multiColors: ['#e362e3', '#7a6ff0', '#37c5ab', '#aa62e3', '#e8384f'],
    primary: 'rgb(115, 103, 240)',
    secondary: 'rgb(216, 93, 216)',
    alternate: 'rgb(65, 69, 97)',
    success: 'rgb(40, 199, 111)',
    danger: 'rgb(234, 84, 85)',
    warning: 'rgb(255, 159, 67)',
    dark: 'rgb(30, 30, 30)',
    text: {
      primary: 'rgb(194, 198, 220)',
      secondary: 'rgb(255, 255, 255)',
    },
    border: 'rgb(65, 69, 97)',
    bg: {
      primary: 'rgb(16, 22, 58)',
      secondary: 'rgb(38, 44, 73)',
    },
  },
};

export default theme;
