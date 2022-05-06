import BaseStyles from 'app/BaseStyles';
import NormalizeStyles from 'app/NormalizeStyles';
import themes from 'app/ThemeStyles';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'darkTheme',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['lightTheme', 'darkTheme'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = themes[context.globals.theme];
    return (
      <>
        <ThemeProvider theme={theme}>
          <BaseStyles />
          <NormalizeStyles />
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </ThemeProvider>
      </>
    );
  },
];
