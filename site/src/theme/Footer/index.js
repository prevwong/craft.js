/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function FooterLink({ to, href, label, ...props }) {
  const toUrl = useBaseUrl(to);
  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            href,
          }
        : {
            to: toUrl,
          })}
      {...props}
    >
      {label}
    </Link>
  );
}

const FooterLogo = ({ url, alt }) => (
  <img className="footer__logo" alt={alt} src={url} />
);

function Footer() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const { themeConfig = {} } = siteConfig;
  const { footer } = themeConfig;

  const { copyright, links = [], logo = {} } = footer || {};
  const logoUrl = useBaseUrl(logo.src);

  if (!footer) {
    return null;
  }

  return (
    <footer
      className={classnames('footer', {
        'footer--dark': footer.style === 'dark',
      })}
    >
      <div className="container">
        {links && links.length > 0 && (
          <div className="row footer__links">
            {links.map((linkItem, i) => (
              <div key={i} className="col footer__col">
                {linkItem.title != null ? (
                  <h4 className="footer__title">{linkItem.title}</h4>
                ) : null}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0 ? (
                  <ul className="footer__items">
                    {linkItem.items.map((item, key) =>
                      item.html ? (
                        <div
                          key={key}
                          dangerouslySetInnerHTML={{
                            __html: item.html,
                          }}
                        />
                      ) : (
                        <li key={item.href || item.to} className="footer__item">
                          <FooterLink {...item} />
                        </li>
                      )
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}
        <div className="footer__end text--center">
          <div className="footer__madewith margin-bottom--md">
            Made with <img src={useBaseUrl('img/heart-fill.png')} /> in Kuala
            Lumpur, Malaysia
          </div>
          <div>Released under the MIT license</div>
          {(logo || copyright) && (
            <div className="">
              {logo && logo.src && (
                <div className="margin-bottom--sm">
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.footerLogoLink}
                    >
                      <FooterLogo alt={logo.alt} url={logoUrl} />
                    </a>
                  ) : (
                    <FooterLogo alt={logo.alt} url={logoUrl} />
                  )}
                </div>
              )}
              {copyright}
            </div>
          )}
          <div className="text--center margin-top--md">
            <a target="_blank" href="https://github.com/prevwong/craft.js">
              <img src="https://img.shields.io/github/stars/prevwong/craft.js?color=%23000&logo=github&style=social" />
            </a>
          </div>
          <div className={'margin-top--md'}>
            <a href="https://www.netlify.com">
              <img
                src="https://www.netlify.com/img/global/badges/netlify-light.svg"
                alt="Deploys by Netlify"
                width="100px"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
