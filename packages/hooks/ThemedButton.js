import { useStateValue } from './state';
import React from "react";

const ThemedButton = ({id}) => {
  const [{ nodes }, dispatch] = useStateValue();
  console.log("re-render")
  return (
    <button
      onClick={() => dispatch({
        type: 'changeTheme',
        id,
        newTheme: "blue"
      })}
    >
      Make me blue! {nodes[id]}
    </button>
  );
}

export default ThemedButton;