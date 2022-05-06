import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import ThemeStyles from 'app/ThemeStyles';

const AllTheProviders = ({ children }) => {
  return <ThemeProvider theme={ThemeStyles.darkTheme}>{children}</ThemeProvider>;
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
