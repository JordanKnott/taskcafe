import React from 'react';
import { action } from '@storybook/addon-actions';
import BaseStyles from 'App/BaseStyles';
import NormalizeStyles from 'App/NormalizeStyles';
import theme from 'App/ThemeStyles';
import styled, { ThemeProvider } from 'styled-components';
import Button from '.';

export default {
  component: Button,
  title: 'Button',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#f8f8f8', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  margin: 25px;
  width: 100%;
  & > button {
    margin-right: 1.5rem;
  }
`;

export const Default = () => {
  return (
    <>
      <BaseStyles />
      <NormalizeStyles />
      <ThemeProvider theme={theme}>
        <ButtonRow>
          <Button>Primary</Button>
          <Button color="success">Success</Button>
          <Button color="danger">Danger</Button>
          <Button color="warning">Warning</Button>
          <Button color="dark">Dark</Button>
          <Button disabled>Disabled</Button>
        </ButtonRow>
        <ButtonRow>
          <Button variant="outline">Primary</Button>
          <Button variant="outline" color="success">
            Success
          </Button>
          <Button variant="outline" color="danger">
            Danger
          </Button>
          <Button variant="outline" color="warning">
            Warning
          </Button>
          <Button variant="outline" color="dark">
            Dark
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </ButtonRow>
        <ButtonRow>
          <Button variant="flat">Primary</Button>
          <Button variant="flat" color="success">
            Success
          </Button>
          <Button variant="flat" color="danger">
            Danger
          </Button>
          <Button variant="flat" color="warning">
            Warning
          </Button>
          <Button variant="flat" color="dark">
            Dark
          </Button>
          <Button variant="flat" disabled>
            Disabled
          </Button>
        </ButtonRow>
        <ButtonRow>
          <Button variant="lineDown">Primary</Button>
          <Button variant="lineDown" color="success">
            Success
          </Button>
          <Button variant="lineDown" color="danger">
            Danger
          </Button>
          <Button variant="lineDown" color="warning">
            Warning
          </Button>
          <Button variant="lineDown" color="dark">
            Dark
          </Button>
          <Button variant="lineDown" disabled>
            Disabled
          </Button>
        </ButtonRow>
        <ButtonRow>
          <Button variant="gradient">Primary</Button>
          <Button variant="gradient" color="success">
            Success
          </Button>
          <Button variant="gradient" color="danger">
            Danger
          </Button>
          <Button variant="gradient" color="warning">
            Warning
          </Button>
          <Button variant="gradient" color="dark">
            Dark
          </Button>
          <Button variant="gradient" disabled>
            Disabled
          </Button>
        </ButtonRow>
        <ButtonRow>
          <Button variant="relief">Primary</Button>
          <Button variant="relief" color="success">
            Success
          </Button>
          <Button variant="relief" color="danger">
            Danger
          </Button>
          <Button variant="relief" color="warning">
            Warning
          </Button>
          <Button variant="relief" color="dark">
            Dark
          </Button>
          <Button variant="relief" disabled>
            Disabled
          </Button>
        </ButtonRow>
      </ThemeProvider>
    </>
  );
};
