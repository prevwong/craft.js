import React, { useState, useCallback, useLayoutEffect } from 'react';
import { Route, Redirect, useLocation } from '@docusaurus/router';

import clsx from 'classnames';
import semver from 'semver';


// Default implementation, that you can customize
function Root({ children }) {
  const location = useLocation();

  // Wait for iframe message if we're in the landing page
  const [isLoaded, setLoaded] = useState(location.pathname !== '/');
  const [waitingForMessage, setWaitingMessage] = useState(
    location.pathname === '/'
  );

  const onMessage = useCallback((msg) => {
    if (!msg.data.LANDING_PAGE_LOADED) {
      return;
    }

    window.requestAnimationFrame(() => {
      setLoaded(true);
      setWaitingMessage(false);
    });
  }, []);

  useLayoutEffect(() => {
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
      className={clsx('app', {
        waitingForLandingMessage: waitingForMessage,
        loaded: isLoaded,
      })}
    >
      {children}
      
      <Route path="/r/" render={({location}) => {
        // Fix old /r/ paths
        let paths = location.pathname.split('/');
        paths = paths.slice(2);

        if (paths[1] === 'next' || semver.valid(paths[1])) {
          paths = [paths[0], ...paths.slice(2)];
        }

        return <Redirect to={`/${paths.join('/')}`} />
      }} />
      <Route path="/examples" component={({ location }) => {
         if ( window !== undefined && process.env.NODE_ENV !== 'development' ) {
          const fullPath = `${window.location.origin}${location.pathname}`;
          window.location.href = fullPath;
         }
       
         return null;
      }} />
    </div>
  );
}

export default Root;
