import React from 'react';
import { EditorState } from '../../interfaces';
export declare function connectEditor<C>(collect?: (state: EditorState) => C): (WrappedComponent: React.ElementType<any>) => (props: any) => JSX.Element;
