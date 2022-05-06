import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: {
      primary: string;
      alternate: string;
    };
    colors: {
      [key: string]: any;
      multiColors: string[];
      primary: string;
      secondary: string;
      success: string;
      danger: string;
      warning: string;
      dark: string;
      alternate: string;
      form: {
        textfield: {
          error: string;
          label: string;
          text: string;
          background: string;
          secondaryLabel: string;
          placeholder: string;
          borderColor: string;
          hover: {
            text: string;
            background: string;
            borderColor: string;
          };
        };
      };
      border: {
        [key: string]: any;
        primary: string;
        secondary: string;
      };
      icon: {
        [key: string]: any;
        primary: string;
        secondary: string;
        alternate: string;
      };
      text: {
        [key: string]: any;
        primary: string;
        secondary: string;
        alternate: string;
      };
      bg: {
        primary: string;
        secondary: string;
      };
    };
  }
}
