import React, {useState, useRef, useMemo} from 'react';

import {Container} from './Container';

export const ContainerSettings = ({actions, props}) => {
    const internal = useMemo(() => {
        return {
            width: props.width
        }
    }, [props])
    console.log(props.width)

    return <div className="flex w-full">
          <div className="w-3/6 flex items-center">
            <div className="w-3/6 flex items-center">
              <h4 style={{ fontSize: "14px", lineHeight: "0" }}>Width</h4>
            </div>
            <div className="w-3/6 ">
              <input
                style={{ fontSize: "14px" }}
                className="w-full rounded-full bg-transparent border outline-none px-2"
                type="text"
                value={props.width}
              />
            </div>
          </div>
        </div>;
}
