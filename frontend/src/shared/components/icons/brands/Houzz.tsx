import React from 'react';
import Icon, { IconProps } from '../Icon';

const Houzz: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 448 512">
            <path d="M275.9 330.7H171.3V480H17V32h109.5v104.5l305.1 85.6V480H275.9z" />
        </Icon>
    );
};

export default Houzz;