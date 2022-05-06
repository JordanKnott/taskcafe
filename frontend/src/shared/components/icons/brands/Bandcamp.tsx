import React from 'react';
import Icon, { IconProps } from '../Icon';

const Bandcamp: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 512 512">
            <path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm48.2,326.1h-181L207.9,178h181Z" />
        </Icon>
    );
};

export default Bandcamp;