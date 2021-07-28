/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

function Home() {
  return (
    <Layout
      title="Build any page editor"
      noFooter={true}
      wrapperClassName="landing-page-contents"
      classNAme="landing-pp"
    >
      <iframe
        style={{ width: '100%', border: 'none', outline: 'none' }}
        src={
          process.env.NODE_ENV === 'production'
            ? '/examples/landing'
            : 'http://localhost:3001'
        }
      />
    </Layout>
  );
}

export default Home;
