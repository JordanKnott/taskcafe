/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { css, keyframes } from 'styled-components';
import Color from 'color';

export const font = {
  regular: 'font-family: "Open Sans", Roboto, sans-serif; font-weight: normal;',
  bold: 'font-family: "Open Sans", Roboto, sans-serif; font-weight: normal;',
  medium: 'font-family: "Open Sans", Roboto, sans-serif; font-weight: normal;',
};

const skeletonKeyframe = keyframes`
100% {
  transform: translateX(100%);
}
  `;

const lighten = (colorValue: string, amount: number) => Color(colorValue).lighten(amount).string();
const rgba = (colorValue: string, opacity: number) => Color(colorValue).alpha(opacity).string();
const darken = (colorValue: string, amount: number) => Color(colorValue).darken(amount).string();

export const mixin = {
  darken,
  lighten,
  rgba,
  skeleton: css`
    background: ${(props) => darken(props.theme.colors.bg.secondary, 0.2)};
    border-radius: 6px;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: -6px;
    bottom: 0;
    left: -6px;
    z-index: 100;
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        ${(props) => rgba(props.theme.colors.bg.secondary, 0)} 0,
        ${(props) => rgba(props.theme.colors.bg.secondary, 0.2)} 20%,
        ${(props) => rgba(props.theme.colors.bg.secondary, 0.5)} 60%,
        ${(props) => rgba(props.theme.colors.bg.secondary, 0)}
      );
      animation: ${skeletonKeyframe} 2s infinite;
      content: '';
    }
  `,
  boxShadowCard: css`
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 2px 0px;
  `,
  boxShadowMedium: css`
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  `,
  boxShadowDropdown: css`
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px;
  `,
  truncateText: css`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `,
  clickable: css`
    cursor: pointer;
    user-select: none;
  `,
  hardwareAccelerate: css`
    transform: translateZ(0);
  `,
  cover: css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `,
  placeholderColor: (colorValue: string) => css`
    ::-webkit-input-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    :-moz-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    ::-moz-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    :-ms-input-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
  `,
};
