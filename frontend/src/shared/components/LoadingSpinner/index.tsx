import React from 'react';

import { LoadingSpinnerWrapper } from './Styles';

type LoadingSpinnerProps = {
  color?: 'primary' | 'danger' | 'success' | 'warning' | 'dark';
  size?: string;
  borderSize?: string;
  thickness?: string;
};

/**
 * The default parameters may not be applicable to every scenario
 *
 * While borderSize and size should be a single prop,
 * it is currently not as such because it would require math to be done to strings
 * e.g "80px - 16"
 *
 *
 * @param color
 * @param size The size of the spinner. It is recommended to be at least 16 px less than the borderSize
 * @param thickness
 * @param borderSize Border size affects the size of the border which if is too small may break the spinner.
 * @constructor
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = 'primary',
  size = '64px',
  thickness = '8px',
  borderSize = '80px',
}) => {
  return (
    <LoadingSpinnerWrapper color={color} size={size} thickness={thickness} borderSize={borderSize}>
      <div />
      <div />
      <div />
    </LoadingSpinnerWrapper>
  );
};

export default LoadingSpinner;
