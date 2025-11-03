import React from 'react';
import * as Icons from '@phosphor-icons/react';

interface IconProps extends Icons.IconProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = (Icons as any)[name]; 

  if (!IconComponent) {
    return <Icons.Question {...props} />; // Fallback icon
  }

  return <IconComponent {...props} />;
};

export default Icon;
