import React from 'react';
import Layout from '@theme/Layout';

function Support() {
  return (
    <Layout title="Support">
      <div className="padding-vert--lg">
        <div className="container">
          <div className="row">
            <div className="col">
              <article>
                <header>
                  <h1
                    style={{
                      fontSize: '3rem',
                      marginBottom: '3rem',
                    }}
                  >
                    Support
                  </h1>
                </header>
                <p>
                  Development for Craft.js began in April 2019 as a personal
                  project of mine. It was months after months of experimenting
                  and trial-and-error until it was able to become a viable
                  solution. The repository was made public and the first public
                  beta release was made in January 2020! Since then, the project
                  has gained traction and contributions from people all over the
                  world.
                </p>
                <p>
                  Craft.js is released under the{' '}
                  <a
                    target="_blank"
                    href="https://github.com/prevwong/craft.js/blob/master/LICENSE"
                  >
                    MIT license
                  </a>{' '}
                  and is built with 100% love. If you found it useful and would
                  like to ensure its continued development, please consider
                  becoming a backer/sponsor or making a one-time donation via{' '}
                  <a
                    href="https://opencollective.com/craftjs/contribute"
                    target="_blank"
                  >
                    Open Collective
                  </a>{' '}
                  or{' '}
                  <a href="https://paypal.me/prevwong" target="_blank">
                    Paypal
                  </a>
                  .
                </p>
                <a
                  href="https://opencollective.com/craftjs/contribute"
                  target="_blank"
                >
                  <img
                    src="https://opencollective.com/craftjs/donate/button@2x.png?color=blue"
                    width={260}
                  />
                </a>
              </article>
            </div>
            <div className="col col--3"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Support;
