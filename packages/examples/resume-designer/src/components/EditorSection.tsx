import React from 'react';



export type EditorSection = {
    title: string;
    children: React.ReactNode
}
export const EditorSection = ({ title, children }: EditorSection) => {
    return (
      <div className="text-sm mb-6 flex items-center w-full">
        <div className="items-center w-full">
          <div className="w-6/6 block md-10">
            <h4 className="cx editor-section-title text-sm mb-1 text-dark-blue">{title}</h4>
          </div>
          <div className="w-6/6">
            <div className="block">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
}
