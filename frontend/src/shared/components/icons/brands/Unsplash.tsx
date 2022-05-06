import React from 'react';
import Icon, { IconProps } from '../Icon';

const Unsplash: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 448 512">
            <path d="M448,230.17V480H0V230.17H141.13V355.09H306.87V230.17ZM306.87,32H141.13V156.91H306.87Z" />
        </Icon>
    );
};

export default Unsplash;