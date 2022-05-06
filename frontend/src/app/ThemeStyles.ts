import { DefaultTheme } from 'styled-components';
import Color from 'color';

export const darkTheme: DefaultTheme = {
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
    form: {
      textfield: {
        background: 'rgb(38, 44, 73)',
        text: 'rgb(255, 255, 255)',
        label: 'rgb(194, 198, 220)',
        placeholder: 'rgb(64, 70, 86)',
        error: 'rgb(234, 84, 85)',
        borderColor: 'rgb(65, 69, 97)',
        secondaryLabel: 'rgb(115, 103, 240)',
        hover: {
          text: 'rgb(255, 255, 255)',
          background: 'none',
          borderColor: 'rgb(115, 103, 240)',
        },
      },
    },
    icon: {
      primary: 'rgb(194, 198, 220)',
      secondary: 'rgb(255, 255, 255)',
      alternate: 'rgb(0, 0, 0)',
      danger: 'rgb(234, 84, 85)',
      colored: 'rgb(115, 103, 240)',
    },
    text: {
      primary: 'rgb(194, 198, 220)',
      secondary: 'rgb(255, 255, 255)',
      alternate: 'rgb(0, 0, 0)',
    },
    border: {
      primary: 'rgb(65, 69, 97)',
      secondary: 'rgb(115, 103, 240)',
    },
    bg: {
      primary: 'rgb(16, 22, 58)',
      secondary: 'rgb(38, 44, 73)',
    },
  },
};

export const lightTheme: DefaultTheme = {
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
    form: {
      textfield: {
        background: 'rgb(250, 251, 252)',
        error: 'rgb(234, 84, 85)',
        text: 'rgb(23, 43, 77)',
        label: 'rgb(94, 108, 132)',
        secondaryLabel: 'rgb(115, 103, 240)',
        borderColor: 'rgb( 233, 225, 230)',
        placeholder: 'rgb(64, 70, 86)',
        hover: {
          text: 'rgb(23, 43, 77)',
          background: 'rgb(255, 255, 255)',
          borderColor: 'rgb(115, 103, 240)',
        },
      },
    },
    icon: {
      primary: 'rgb(194, 198, 220)',
      secondary: 'rgb(0, 0, 0)',
      alternate: 'rgb(0, 0, 0)',
      colored: 'rgb(115, 103, 240)',
      danger: 'rgb(234, 84, 85)',
    },
    text: {
      primary: 'rgb(194, 198, 220)',
      secondary: 'rgb(255, 255, 255)',
      alternate: 'rgb(0, 0, 0)',
    },
    border: {
      primary: 'rgb(223, 225,  230)',
      secondary: 'rgb(115, 103, 240)',
    },
    bg: {
      primary: 'rgb(0, 22, 58)',
      secondary: 'rgb(250, 251, 252)',
    },
  },
};

export default {
  darkTheme,
  lightTheme,
};
