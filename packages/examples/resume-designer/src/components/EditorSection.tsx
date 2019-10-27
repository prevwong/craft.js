import React from 'react';
import styled from 'styled-components';

const EditorSectionItem = styled.div`
  .editor-section-title {
    color:rgba(255,255,255,0.8);
    font-size:14px;
  }
`


export type EditorSection = {
    title: string;
    children: React.ReactNode
}
export const EditorSection = ({ title, children }: EditorSection) => {
    return (
      <EditorSectionItem className="mb-6 flex items-center w-full">
        <div className="items-center w-full">
          <div className="w-6/6 block md-10">
            <h4 className="cx editor-section-title text-md mb-1">{title}</h4>
          </div>
          <div className="w-6/6">
            <div className="block">
              {children}
            </div>
          </div>
        </div>
      </EditorSectionItem>
    )
}
