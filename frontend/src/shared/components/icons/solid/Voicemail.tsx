import React from 'react';
import Icon, { IconProps } from '../Icon';

const Voicemail: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 640 512">
            <path d="M496 128a144 144 0 0 0-119.74 224H263.74A144 144 0 1 0 144 416h352a144 144 0 0 0 0-288zM64 272a80 80 0 1 1 80 80 80 80 0 0 1-80-80zm432 80a80 80 0 1 1 80-80 80 80 0 0 1-80 80z" />
        </Icon>
    );
};

export default Voicemail;