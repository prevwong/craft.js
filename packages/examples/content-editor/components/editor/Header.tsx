import React from "react";
import { useManager } from "craftjs";

export const Header = ({setEnabled}) => {
  const {enabled, query} = useManager((state) => ({
    enabled: state.options.enabled
  }));

  return (
    <>
      <button onClick={() => setEnabled(!enabled)}>{enabled ? "Disable" : "Enable"}</button>
      <button onClick={() => {
        const s = query.serialize();
        const d = query.deserialize(JSON.stringify(s));
        console.log(JSON.stringify(s), d);
      }}>Serialize</button>
    </>
  )
}

