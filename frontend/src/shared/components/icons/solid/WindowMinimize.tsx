import React from 'react';
import Icon, { IconProps } from '../Icon';

const WindowMinimize: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 512 512">
            <path d="M464 352H48c-26.5 0-48 21.5-48 48v32c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-32c0-26.5-21.5-48-48-48z" />
        </Icon>
    );
};

export default WindowMinimize;