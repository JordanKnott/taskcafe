import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';
import ControlledInput from 'shared/components/ControlledInput';
import theme from 'App/ThemeStyles';

export const Container = styled.div<{
  invertY: boolean;
  invert: boolean;
  targetPadding: string;
  top: number;
  left: number;
  ref: any;
  width: number | string;
}>`
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  display: block;
  position: absolute;
  width: ${props => props.width}px;
  padding-top: ${props => props.targetPadding};
  height: auto;
  z-index: 40000;
  ${props =>
    props.invert &&
    css`
      transform: translate(-100%);
    `}
  ${props =>
    props.invertY &&
    css`
      top: auto;
      padding-top: 0;
      padding-bottom: ${props.targetPadding};
      bottom: ${props.top}px;
    `}
`;

export const Wrapper = styled.div<{ padding: boolean; borders: boolean }>`
  ${props =>
    props.padding &&
    css`
      padding: 5px;
      padding-top: 8px;
    `}
  border-radius: 5px;
  box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0;

  color: #c2c6dc;
  background: #262c49;
  ${props =>
    props.borders &&
    css`
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-color: #414561;
    `}
`;

export const Header = styled.div`
  height: 40px;
  position: relative;
  margin-bottom: 8px;
  text-align: center;
`;

export const HeaderTitle = styled.span`
  box-sizing: border-box;
  color: #c2c6dc;
  display: block;
  border-bottom: 1px solid #414561;
  margin: 0 12px;
  overflow: hidden;
  padding: 0 32px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;

  height: 40px;
  line-height: 18px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  max-height: 632px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar-track-piece {
    background: ${props => props.theme.colors.bg.primary};
    border-radius: 20px;
  }
`;

export const LabelSearch = styled(ControlledInput)`
  margin: 12px 12px 0 12px;
`;

export const Section = styled.div`
  margin-top: 12px;
  margin: 12px 12px 0 12px;
`;

export const SectionTitle = styled.h4`
  color: #c2c6dc;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 16px;
  margin-top: 16px;
  text-transform: uppercase;
`;

export const Labels = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 8px;
`;

export const Label = styled.li`
  padding-right: 36px;
  position: relative;
`;
export const CardLabel = styled.span<{ active: boolean; color: string }>`
  ${props =>
    props.active &&
    css`
      margin-left: 4px;
      box-shadow: -8px 0 ${mixin.darken(props.color, 0.12)};
      border-radius: 3px;
    `}

  cursor: pointer;
  font-weight: 700;
  margin: 0 0 4px;
  min-height: 20px;
  padding: 6px 12px;
  position: relative;
  transition: padding 85ms, margin 85ms, box-shadow 85ms;
  background-color: ${props => props.color};
  color: #fff;
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 31px;
`;

export const CloseButton = styled.div`
  padding: 18px 18px 14px 12px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  cursor: pointer;
`;

export const LabelIcon = styled.div`
  border-radius: 3px;
  padding: 6px;
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  font-size: 16px;
  line-height: 20px;
  width: auto;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

export const ActiveIcon = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.85;

  font-size: 16px;
  line-height: 20px;
  width: 20px;
`;

export const EditLabelForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  font-weight: 700;
  color: #5e6c84;
  font-size: 12px;
  line-height: 16px;
  margin-top: 12px;
  margin-bottom: 4px;
  display: block;
`;

export const FieldName = styled.input`
  margin: 4px 0 12px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  line-height: 20px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #262c49;
  outline: none;
  color: #c2c6dc;

  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  border-color: #414561;

  font-size: 12px;
  font-weight: 400;

  &:focus {
    box-shadow: ${props => props.theme.colors.primary} 0px 0px 0px 1px;
    background: ${mixin.darken(theme.colors.bg.secondary, 0.15)};
  }
`;

export const LabelBox = styled.span<{ color: string }>`
  float: left;
  height: 32px;
  margin: 0 8px 8px 0;
  padding: 0;
  width: 48px;

  cursor: pointer;
  background-color: ${props => props.color};
  border-radius: 4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.8;
  }
`;

export const SaveButton = styled.input`
  background: ${props => props.theme.colors.primary};
  box-shadow: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  line-height: 20px;
  margin-right: 4px;
  padding: 6px 12px;
  text-align: center;
  border-radius: 3px;
`;

export const DeleteButton = styled.input`
  float: right;
  outline: none;
  border: none;
  line-height: 20px;
  padding: 6px 12px;
  background-color: transparent;
  text-align: center;
  color: #c2c6dc;
  font-weight: 400;
  line-height: 20px;
  cursor: pointer;

  margin: 0 0 0 8px;

  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  border-color: #414561;

  &:hover {
    color: #fff;
    background: ${props => props.theme.colors.primary};
    border-color: transparent;
  }
`;

export const CreateLabelButton = styled.button`
  outline: none;
  border: none;
  width: 100%;
  border-radius: 3px;
  line-height: 20px;
  margin-bottom: 8px;
  padding: 6px 12px;
  background-color: none;
  text-align: center;
  color: #c2c6dc;
  margin: 8px 4px 0 0;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

export const PreviousButton = styled.div`
  padding: 18px 18px 14px 12px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  cursor: pointer;
`;

export const ContainerDiamond = styled.div<{ borders: boolean; color: string; invert: boolean; invertY: boolean }>`
  ${props => (props.invert ? 'right: 10px; ' : 'left: 15px;')}
  position: absolute;
  width: 10px;
  height: 10px;
  display: block;
  ${props =>
    props.invertY
      ? css`
          bottom: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        `
      : css`
          top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          border-left: 1px solid rgba(0, 0, 0, 0.1);
        `}
  transform: rotate(45deg) translate(-7px);
  z-index: 10;

  background: ${props => props.color};
  ${props =>
    props.borders &&
    css`
      border-color: #414561;
    `}
`;
