import React from 'react';
import Icon, { IconProps } from '../Icon';

const Play: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 448 512">
            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
        </Icon>
    );
};

export default Play;