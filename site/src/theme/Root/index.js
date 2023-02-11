import React from 'react';
import { useLocation } from '@docusaurus/router';
import cx from 'classnames';

// Default implementation, that you can customize
export default function Root({ children }) {
  const location = useLocation();

  // Wait for iframe message if we're in the landing page
  const [isLoaded, setLoaded] = React.useState(location.pathname !== '/');
  const [waitingForMessage, setWaitingMessage] = React.useState(
    location.pathname === '/'
  );

  const onMessage = React.useCallback((msg) => {
    if (!msg.data.LANDING_PAGE_LOADED) {
      return;
    }

    window.requestAnimationFrame(() => {
      setLoaded(true);
      setWaitingMessage(false);
    });
  }, []);

  React.useLayoutEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <div
      className={cx('app', {
        waitingForLandingMessage: waitingForMessage,
        loaded: isLoaded,
      })}
    >
      {children}
    </div>
  );
}
