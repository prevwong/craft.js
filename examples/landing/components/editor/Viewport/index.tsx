import React, { useEffect } from 'react';
import cx from 'classnames';
import { useEditor } from '@craftjs/core';
import { Toolbox } from './Toolbox';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Viewport: React.FC = ({ children }) => {
  const { enabled, connectors, actions } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  useEffect(() => {
    if (!window) {
      return;
    }

    window.requestAnimationFrame(() => {
      // Notify doc site
      window.parent.postMessage(
        {
          LANDING_PAGE_LOADED: true,
        },
        '*'
      );

      setTimeout(() => {
        actions.setOptions((options) => {
          options.enabled = true;
        });
      }, 200);
    });
  }, []);

  return (
    <div className="viewport">
      <div
        className={cx(['flex h-full overflow-hidden flex-row w-full fixed'])}
      >
        <Toolbox />
        <div className="flex flex-1 h-full flex-col">
          <Header />

          <div
            className={cx([
              'craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto',
              {
                'bg-renderer-gray': enabled,
              },
            ])}
            ref={(ref) => connectors.select(connectors.hover(ref, null), null)}
          >
            <div className="relative flex-col flex items-center pt-8">
              {children}
            </div>
            <div
              className={
                'flex items-center justify-center w-full pt-6 text-xs text-light-gray-2'
              }
            >
              <a href="https://www.netlify.com">
                This site is powered by Netlify
              </a>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};
