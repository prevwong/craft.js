import React from 'react';

export const Badge = ({ type, title = true, noMargin = true }) => {
  let name;
  switch (type) {
    case 'hoc':
      name = 'Higher-Order Component';
      break;
    default:
      name = type[0].toUpperCase() + type.substring(1);
  }

  return (
    <div className="badge-wrapper">
      <span
        className={`badge badge-${type} ${title ? 'badge-title' : ''} ${
          noMargin ? 'badge-no-margin' : ''
        }`}
      >
        {name}
      </span>
    </div>
  );
};
