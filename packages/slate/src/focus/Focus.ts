// TODO: how can better represent supplementary components in Craft
import React from 'react';
import { useEditor } from '@craftjs/core';

export const WithFocus = ({ children }: any) => {
  // const { actions, isEmpty } = useEditor((_, query) => ({
  //   isEmpty: query.getEvent('selected').isEmpty()
  // }));
  //
  // useEffect(() => {
  //   console.log('focus is empty', isEmpty)
  // }, [isEmpty]);

  return React.createElement('div', { children });
};

WithFocus.craft = {
  defaultProps: {
    selection: {
      id: null,
      focus: null,
    },
  },
};
