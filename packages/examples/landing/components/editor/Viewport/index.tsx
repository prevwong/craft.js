import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useEditor } from '@craftjs/core';
import { Toolbox } from './Toolbox';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import {
  Button as MaterialButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
export const Viewport: React.FC = ({ children }) => {
  const { enabled, connectors } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const [loaded, setLoaded] = useState(false);
  const [mouseEnabled, setMouseEnabled] = useState(false);
  const [dialog, setDialog] = useState(false);

  let unmounted = false;
  // animations with setTimeouts. I know, don't judge me! :p
  useEffect(() => {
    setTimeout(() => {
      if (!unmounted) setLoaded(true);
      setTimeout(() => {
        if (
          localStorage &&
          localStorage.getItem('craftjs-demo-notice') != 'set'
        ) {
          setDialog(true);
          localStorage.setItem('craftjs-demo-notice', 'set');
        }
        setTimeout(() => {
          if (!unmounted) setMouseEnabled(true);
        }, 200);
      }, 400);
    }, 1000);

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div
      className={cx(['viewport'], {
        loaded: loaded,
        'mouse-enabled': mouseEnabled,
      })}
    >
      <Dialog
        open={dialog}
        fullWidth={true}
        maxWidth="sm"
        onClose={() => setDialog(false)}
        disableBackdropClick={true}
      >
        <DialogTitle>{'Keep the following in mind'}</DialogTitle>
        <DialogContent>
          <ul className="px-5 list-disc" style={{ opacity: 0.85 }}>
            <li>
              Craft.js is an abstraction, this demo is an implementation of it.
              If you don't like the UI for example, please know that it is the
              demo and not the framework.
            </li>
            <li>
              This is a beta release. Bugs are to be expected. If you find one,
              please file an issue at the Github repo
            </li>
            <li>Mobile support will come in the future</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <MaterialButton
            onClick={() => setDialog(false)}
            color="primary"
            autoFocus
          >
            Okay!
          </MaterialButton>
        </DialogActions>
      </Dialog>
      <Header />
      <div
        style={{ paddingTop: '59px' }}
        className={cx([
          'flex h-full overflow-hidden flex-row w-full',
          {
            'h-full': !enabled,
            fixed: enabled,
            relative: !enabled,
          },
        ])}
      >
        <Toolbox />
        <div className="flex-1 h-full">
          <div className="w-full h-full">
            <div
              className={cx([
                'craftjs-renderer h-full  w-full transition',
                {
                  'overflow-auto': enabled,
                  'bg-renderer-gray': enabled,
                },
              ])}
              ref={(ref) =>
                connectors.select(connectors.hover(ref, null), null)
              }
            >
              <div
                className={cx([
                  'relative flex-col flex items-center pb-8',
                  {
                    'pt-8': enabled,
                  },
                ])}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};
