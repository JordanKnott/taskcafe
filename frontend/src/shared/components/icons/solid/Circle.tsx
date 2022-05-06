import React from 'react';
import Icon, { IconProps } from '../Icon';

const Circle: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 512 512">
            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
        </Icon>
    );
};

export default Circle;