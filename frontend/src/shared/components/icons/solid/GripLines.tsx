import React from 'react';
import Icon, { IconProps } from '../Icon';

const GripLines: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 512 512">
            <path d="M496 288H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z" />
        </Icon>
    );
};

export default GripLines;