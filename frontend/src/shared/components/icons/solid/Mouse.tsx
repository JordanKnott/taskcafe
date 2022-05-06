import React from 'react';
import Icon, { IconProps } from '../Icon';

const Mouse: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 384 512">
            <path d="M0 352a160 160 0 0 0 160 160h64a160 160 0 0 0 160-160V224H0zM176 0h-16A160 160 0 0 0 0 160v32h176zm48 0h-16v192h176v-32A160 160 0 0 0 224 0z" />
        </Icon>
    );
};

export default Mouse;