import React from 'react';
import Icon, { IconProps } from '../Icon';

const GripLinesVertical: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 256 512">
            <path d="M96 496V16c0-8.8-7.2-16-16-16H48c-8.8 0-16 7.2-16 16v480c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16zm128 0V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v480c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16z" />
        </Icon>
    );
};

export default GripLinesVertical;