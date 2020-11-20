import { useEditor } from '@craftjs/core';
import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

export const useFocus = (id?: string, callback?: any) => {
  const { focus, actions } = useEditor((state) => ({
    focus: state.nodes['ROOT'] && state.nodes['ROOT'].data.props.selection,
  }));

  const value = useRef(null);

  useEffect(() => {
    if (!id || !callback) {
      return;
    }

    if (!focus || (focus && focus.id !== id)) {
      value.current = null;
    } else {
      value.current = focus.focus;
    }

    callback(value.current);
  }, [focus]);

  const setFocus = useCallback((id, focus) => {
    actions.setProp('ROOT', (props) => {
      props.selection.id = id;
      props.selection.focus = focus;
    });
  }, []);

  const clearFocus = useCallback(() => {
    actions.setProp('ROOT', (props) => {
      props.selection.id = null;
      props.selection.focus = null;
    });
  }, []);

  return {
    setFocus,
    clearFocus,
  };
};
