import React from 'react';

const Item = ({ item }) => {
  const title = item[0];
  const type = item.length > 1 && typeof item[1] == 'string' && item[1];
  const description =
    item.length == 3
      ? typeof item[2] == 'string' && item[2]
      : item.length == 4 && typeof item[3] == 'string' && item[3];
  const children =
    item.length > 1 &&
    Array.isArray(item[item.length - 1]) &&
    item[item.length - 1];

  return (
    <li className="api-item">
      <div>
        {title && <code className="api-title">{title}</code>}
        {type && <strong className="api-type">{type}</strong>}
      </div>
      {description && (
        <div
          className="api-description"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      )}
      {children && <API items={children} />}
    </li>
  );
};

export const API = ({ items }) => {
  return (
    <ul>{items && items.map((child, i) => <Item item={child} key={i} />)}</ul>
  );
};

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
