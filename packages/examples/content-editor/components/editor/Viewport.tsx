import React from "react";
import cx from "classnames";
import { useEditor } from "craftjs";

export const Viewport: React.FC = ({children}) => {
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));

  return (
    <div style={{paddingTop: "59px"}} className={cx(["flex h-full flex-row w-full", {
      "h-full": !enabled,
      "fixed": enabled,
      "relative": !enabled
    }])}>
      {children}
    </div>
  )
}