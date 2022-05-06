import React from 'react';
import Icon, { IconProps } from '../Icon';

const WindowMinimize: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 512 512">
            <path d="M480 480H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h448c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </Icon>
    );
};

export default WindowMinimize;