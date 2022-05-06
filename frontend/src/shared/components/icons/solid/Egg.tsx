import React from 'react';
import Icon, { IconProps } from '../Icon';

const Egg: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 384 512">
            <path d="M192 0C86 0 0 214 0 320s86 192 192 192 192-86 192-192S298 0 192 0z" />
        </Icon>
    );
};

export default Egg;