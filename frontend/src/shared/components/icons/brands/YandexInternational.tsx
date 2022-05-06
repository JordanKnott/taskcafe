import React from 'react';
import Icon, { IconProps } from '../Icon';

const YandexInternational: React.FC<IconProps> = (args) => {
    return (
        <Icon {...args} viewBox="0 0 320 512">
            <path d="M129.5 512V345.9L18.5 48h55.8l81.8 229.7L250.2 0h51.3L180.8 347.8V512h-51.3z" />
        </Icon>
    );
};

export default YandexInternational;