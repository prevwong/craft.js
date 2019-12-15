import React  from "react";
import {Button as MaterialButton} from "@material-ui/core";
import {useNode} from "craftjs";

export default function Button({size, variant, primary, children}) {
  const { connectors: {connect, drag} } = useNode();
  return (
    <MaterialButton ref={ ref => connect(drag(ref))} style={{margin: "5px"}} size={size} variant={variant} color={primary}>
      {children}
    </MaterialButton>
  )
}