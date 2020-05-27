import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const Container = styled.div<{ invert: boolean; top: number; left: number; ref: any }>`
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  display: block;
  position: absolute;
  width: 316px;
  padding-top: 10px;
  height: auto;
  z-index: 40000;
  ${props =>
    props.invert &&
    css`
      transform: translate(-100%);
    `}
`;

export const Wrapper = styled.div`
  padding: 5px;
  padding-top: 8px;
  border-radius: 5px;
  box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0;

  color: #c2c6dc;
  background: #262c49;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
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
  line-height: 40px;
  border-bottom: 1px solid #414561;
  margin: 0 12px;
  overflow: hidden;
  padding: 0 32px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;
`;

export const Content = styled.div`
  max-height: 632px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 12px 12px;
`;
export const LabelSearch = styled.input`
  box-sizing: border-box;
  display: block;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 85ms;
  transition-timing-function: ease;
  margin: 4px 0 12px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  line-height: 20px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: 'Droid Sans';
  font-weight: 400;

  background: #262c49;
  outline: none;
  color: #c2c6dc;
  border-color: #414561;

  &:focus {
    box-shadow: rgb(115, 103, 240) 0px 0px 0px 1px;
    background: ${mixin.darken('#262c49', 0.15)};
  }
`;

export const Section = styled.div`
  margin-top: 12px;
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
  padding: 10px 12px 10px 8px;
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
    background: rgb(115, 103, 240);
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
  border-radius: 3px;
  display: block;
  line-height: 20px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #262c49;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;

  font-size: 12px;
  font-weight: 400;

  color: #c2c6dc;

  &:focus {
    box-shadow: rgb(115, 103, 240) 0px 0px 0px 1px;
    background: ${mixin.darken('#262c49', 0.15)};
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
`;

export const SaveButton = styled.input`
  cursor: pointer;
  background-color: #5aac44;
  box-shadow: none;
  border: none;
  color: #fff;
  padding-left: 24px;
  padding-right: 24px;
  ursor: pointer;
  display: inline-block;
  font-weight: 400;
  line-height: 20px;
  margin: 8px 4px 0 0;
  padding: 6px 12px;
  text-align: center;
  border-radius: 3px;
`;

export const DeleteButton = styled.input`
  background-color: #cf513d;
  box-shadow: none;
  border: none;
  color: #fff;
  cursor: pointer;
  type="submit"font-weight: 400;
  line-height: 20px;
  margin: 8px 4px 0 0;
  padding: 6px 12px;
  text-align: center;
  border-radius: 3px;
  float: right;
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
    background: rgb(115, 103, 240);
  }
`;

export const PreviousButton = styled.div`
  padding: 10px 12px 10px 8px;
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

export const ContainerDiamond = styled.div<{ invert: boolean }>`
  top: 10px;
  ${props => (props.invert ? 'right: 10px; ' : 'left: 15px;')}
  position: absolute;
  width: 10px;
  height: 10px;
  display: block;
  transform: rotate(45deg) translate(-7px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 10;

  background: #262c49;
  border-color: #414561;
`;
