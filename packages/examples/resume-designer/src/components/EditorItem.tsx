import React from 'react';

export type EditorItem = {
    title: string;
    full?: boolean;
    children: React.ReactNode
}
export const EditorItem = ({title, full=false, children}: EditorItem) => {
    return (
        <div className={`cx w-${full ? 'full' : '3/6'} flex items-center`}>
          <div className="w-3/6 flex items-center">
            <h4 style={{ fontSize: "14px", lineHeight: "0" }}>{title}</h4>
          </div>
          <div className="flex-1">
           {children}
          </div>
        </div>
    )
}
