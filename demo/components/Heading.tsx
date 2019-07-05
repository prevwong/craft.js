import React, { Fragment, useRef } from "react";
import {useManager} from "~packages/core/manager/useManager";

export const Heading = ({text}: any) => {
  const {query} = useManager((state) => state);
  const c = useRef(false);

  return (
   <Fragment>
      <h2>Heading</h2>
      <a onClick={() => {
        query.serialize();
        c.current = true;
      }}>Click me</a>
   </Fragment>
  )
}