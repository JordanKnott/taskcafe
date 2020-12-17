// import original module declarations
import 'styled-components';

// and extend them!
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
      text: {
        primary: string;
        secondary: string;
      };
      bg: {
        primary: string;
        secondary: string;
      };
    };
  }
}
