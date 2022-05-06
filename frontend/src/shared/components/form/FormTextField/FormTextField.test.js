import React from 'react';
import { render, screen } from 'shared/testing/utils';
import FormTextField from '.';

it('renders without crashing', () => {
  render(<FormTextField label="Username" />);
  expect(screen.getByText('Username')).toBeInTheDocument();
});
