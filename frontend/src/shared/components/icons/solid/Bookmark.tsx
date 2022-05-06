import React from 'react';
import Icon, { IconProps } from '../Icon';

const Bookmark: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 384 512">
            <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z" />
        </Icon>
    );
};

export default Bookmark;