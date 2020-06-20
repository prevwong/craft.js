import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const Image = ({ img }) => {
  const context = useDocusaurusContext();
  const {
    siteConfig: { baseUrl },
  } = context;

  return (
    <div className="img-wrapper">
      <div>
        <header>
          <div></div>
          <div></div>
          <div></div>
        </header>
        <img src={`${baseUrl}img/${img}`} />
      </div>
    </div>
  );
};
