import React from 'react';
import Icon, { IconProps } from '../Icon';

const Flipboard: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 448 512">
            <path d="M0 32v448h448V32H0zm358.4 179.2h-89.6v89.6h-89.6v89.6H89.6V121.6h268.8v89.6z" />
        </Icon>
    );
};

export default Flipboard;