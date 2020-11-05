import { useEditor } from '@craftjs/core';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ContentEditable from 'react-contenteditable';

import { useLayer } from '../useLayer';

export const EditableLayerName = () => {
  const { id } = useLayer();

  const { displayName, actions } = useEditor((state) => ({
    displayName:
      state.nodes[id] && state.nodes[id].data.custom.displayName
        ? state.nodes[id].data.custom.displayName
        : state.nodes[id].data.displayName,
    hidden: state.nodes[id] && state.nodes[id].data.hidden,
  }));

  const [editingName, setEditingName] = useState(false);
  const nameDOM = useRef<HTMLElement | null>(null);

  const clickOutside = useCallback((e) => {
    if (nameDOM.current && !nameDOM.current.contains(e.target)) {
      setEditingName(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('click', clickOutside);
    };
  }, [clickOutside]);

  return (
    <ContentEditable
      html={displayName}
      disabled={!editingName}
      ref={(ref: any) => {
        if (ref) {
          nameDOM.current = ref.el.current;
          window.removeEventListener('click', clickOutside);
          window.addEventListener('click', clickOutside);
        }
      }}
      onChange={(e) => {
        actions.setCustom(
          id,
          (custom) => (custom.displayName = e.target.value)
        );
      }}
      tagName="h2"
      onDoubleClick={() => {
        if (!editingName) setEditingName(true);
      }}
    />
  );
};
