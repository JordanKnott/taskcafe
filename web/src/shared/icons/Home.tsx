import React from 'react';

type Props = {
  size: number | string;
  color: string;
};

const Home = ({ size, color }: Props) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
      <path d="M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z" />
    </svg>
  );
};

Home.defaultProps = {
  size: 16,
  color: '#000',
};

export default Home;
