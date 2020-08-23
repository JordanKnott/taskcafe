import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

const colourStyles = {
  control: (styles: any, data: any) => {
    return {
      ...styles,
      backgroundColor: data.isMenuOpen ? mixin.darken('#262c49', 0.15) : '#262c49',
      boxShadow: data.menuIsOpen ? 'rgb(115, 103, 240) 0px 0px 0px 1px' : 'none',
      borderRadius: '3px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderImage: 'initial',
      borderColor: '#414561',
      ':hover': {
        boxShadow: 'rgb(115, 103, 240) 0px 0px 0px 1px',
        borderRadius: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderImage: 'initial',
        borderColor: '#414561',
      },
      ':active': {
        boxShadow: 'rgb(115, 103, 240) 0px 0px 0px 1px',
        borderRadius: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderImage: 'initial',
        borderColor: 'rgb(115, 103, 240)',
      },
    };
  },
  menu: (styles: any) => {
    return {
      ...styles,
      backgroundColor: mixin.darken('#262c49', 0.15),
    };
  },
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#c2c6dc', ':hover': { color: '#c2c6dc' } }),
  indicatorSeparator: (styles: any) => ({ ...styles, color: '#c2c6dc' }),
  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      // eslint-disable-next-line no-nested-ternary
      backgroundColor: isDisabled
        ? null
        : // eslint-disable-next-line no-nested-ternary
        isSelected
        ? mixin.darken('#262c49', 0.25)
        : isFocused
        ? mixin.darken('#262c49', 0.15)
        : null,
      // eslint-disable-next-line no-nested-ternary
      color: isDisabled ? '#ccc' : isSelected ? '#fff' : '#c2c6dc',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? mixin.darken('#262c49', 0.25) : '#fff'),
      },
      ':hover': {
        ...styles[':hover'],
        backgroundColor: !isDisabled && (isSelected ? 'rgb(115, 103, 240)' : 'rgb(115, 103, 240)'),
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

const InputLabel = styled.span<{ width: string }>`
width: ${props => props.width};
padding-left: 0.7rem;
color: rgba(115, 103, 240);
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
