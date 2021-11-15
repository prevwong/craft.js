import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const Image = ({ img, src }) => {
  const context = useDocusaurusContext();
  const {
    siteConfig: { baseUrl },
  } = context;

  const imageSrc = src || `${baseUrl}img/${img}}`;

  return (
    <div className="img-wrapper">
      <div>
        <header>
          <div></div>
          <div></div>
          <div></div>
        </header>
        <img src={imageSrc} />
      </div>
    </div>
  );
};
