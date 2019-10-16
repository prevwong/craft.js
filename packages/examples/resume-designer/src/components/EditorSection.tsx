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
      <EditorSectionItem className="mb-4 flex items-center w-full">
        <div className="cx items-center flex w-full">
          <div className="w-2/6">
            <h4 className="editor-section-title text-md">{title}</h4>
          </div>
          <div className="w-4/6">
            {children}
          </div>
        </div>
      </EditorSectionItem>
    )
}
