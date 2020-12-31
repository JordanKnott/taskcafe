import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';
import theme from 'App/ThemeStyles';

function getBackgroundColor(isDisabled: boolean, isSelected: boolean, isFocused: boolean) {
  if (isDisabled) {
    return null;
  }
  if (isSelected) {
    return mixin.darken(theme.colors.bg.secondary, 0.25);
  }
  if (isFocused) {
    return mixin.darken(theme.colors.bg.secondary, 0.15);
  }
  return null;
}

export const colourStyles = {
  control: (styles: any, data: any) => {
    return {
      ...styles,
      backgroundColor: data.isMenuOpen ? mixin.darken(theme.colors.bg.secondary, 0.15) : theme.colors.bg.secondary,
      boxShadow: data.menuIsOpen ? `${theme.colors.primary} 0px 0px 0px 1px` : 'none',
      borderRadius: '3px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderImage: 'initial',
      borderColor: theme.colors.alternate,
      ':hover': {
        boxShadow: `${theme.colors.primary} 0px 0px 0px 1px`,
        borderRadius: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderImage: 'initial',
        borderColor: theme.colors.alternate,
      },
      ':active': {
        boxShadow: `${theme.colors.primary} 0px 0px 0px 1px`,
        borderRadius: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderImage: 'initial',
        borderColor: `${theme.colors.primary}`,
      },
    };
  },
  menu: (styles: any) => {
    return {
      ...styles,
      backgroundColor: mixin.darken(theme.colors.bg.secondary, 0.15),
    };
  },
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#c2c6dc', ':hover': { color: '#c2c6dc' } }),
  indicatorSeparator: (styles: any) => ({ ...styles, color: '#c2c6dc' }),
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: getBackgroundColor(isDisabled, isSelected, isFocused),
      color: isDisabled ? '#ccc' : isSelected ? '#fff' : '#c2c6dc', // eslint-disable-line
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? mixin.darken(theme.colors.bg.secondary, 0.25) : '#fff'),
      },
      ':hover': {
        ...styles[':hover'],
        backgroundColor: !isDisabled && (isSelected ? theme.colors.primary : theme.colors.primary),
      },
    };
  },
  placeholder: (styles: any) => ({ ...styles, color: '#c2c6dc' }),
  clearIndicator: (styles: any) => ({ ...styles, color: '#c2c6dc', ':hover': { color: '#c2c6dc' } }),
  input: (styles: any) => ({
    ...styles,
    color: '#fff',
  }),
  singleValue: (styles: any) => {
    return {
      ...styles,
      color: '#fff',
    };
  },
};

export const editorColourStyles = {
  ...colourStyles,
  input: (styles: any) => ({
    ...styles,
    color: '#000',
  }),
  singleValue: (styles: any) => {
    return {
      ...styles,
      color: '#000',
    };
  },
  menu: (styles: any) => {
    return {
      ...styles,
      backgroundColor: '#fff',
    };
  },
  indicatorsContainer: (styles: any) => {
    return {
      ...styles,
      display: 'none',
    };
  },
  container: (styles: any) => {
    return {
      ...styles,
      display: 'flex',
      flex: '1 1',
    };
  },
  control: (styles: any, data: any) => {
    return {
      ...styles,
      flex: '1 1',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      borderRadius: '0',
      minHeight: '35px',
      border: '0',
      ':hover': {
        boxShadow: 'none',
        borderRadius: '0',
      },
      ':active': {
        boxShadow: 'none',
        borderRadius: '0',
      },
    };
  },
};

const InputLabel = styled.span<{ width: string }>`
width: ${props => props.width};
padding-left: 0.7rem;
color: ${props => props.theme.colors.primary};
left: 0;
top: 0;
transition: all 0.2s ease;
position: absolute;
border-radius: 5px;
overflow: hidden;
font-size: 0.85rem;
cursor: text;
font-size: 12px;
user-select: none;
pointer-events: none;
}
`;

const SelectContainer = styled.div`
  position: relative;
  padding-top: 24px;
`;

type SelectProps = {
  label?: string;
  onChange: (e: any) => void;
  value: any;
  options: Array<any>;
  className?: string;
};

const SelectElement: React.FC<SelectProps> = ({ onChange, value, options, label, className }) => {
  return (
    <SelectContainer className={className}>
      <Select
        onChange={(e: any) => {
          onChange(e);
        }}
        value={value}
        styles={colourStyles}
        classNamePrefix="teamSelect"
        options={options}
      />
      {label && <InputLabel width="100%">{label}</InputLabel>}
    </SelectContainer>
  );
};

export default SelectElement;
