import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<SelectProps> = ({ className = '', ...props }) => {
  return (
    <select
      {...props}
      className={`p-2 border rounded-sm bg-inherit text-black dark:text-white ${className}`.trim()}
    />
  );
};

export default Select;
