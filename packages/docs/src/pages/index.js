/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import {Redirect} from '@docusaurus/router';


function Home() {
  if (typeof window !== 'undefined') {
    window.location.href="https://prevwong.github.io/craft.js";
    return <p style={{padding: "10px", textAlign:"center"}}>Redirecting...</p>
  } else {
    return  <Redirect to="docs/overview" />;
  }
}

export default Home;
