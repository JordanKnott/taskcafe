import React from 'react';
import Icon, { IconProps } from '../Icon';

const SquareFull: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 512 512">
            <path d="M512 512H0V0h512v512z" />
        </Icon>
    );
};

export default SquareFull;