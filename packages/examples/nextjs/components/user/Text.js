import React from "react";
import { Typography } from "@material-ui/core";
import { useNode } from "craftjs";

export default function Text({children, variant}) {
  const { connect, drag } = useNode();
  return (
    <div ref={ref=> connect(drag(ref))} style={{padding: "5px"}}>
     <Typography  variant={variant} align="left">
      {children}
    </Typography>   
    </div>
  )
}