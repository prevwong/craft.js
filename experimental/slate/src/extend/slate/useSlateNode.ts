import { useContext } from 'react';

import { SlateNodeContext } from './SlateNodeContext';

import { SlateSetupContext } from '../../setup';

export const useSlateNode = () => {
  const slateNodeContext = useContext(SlateNodeContext);
  const slateSetupContext = useContext(SlateSetupContext);

  return {
    ...slateNodeContext,
    config: slateSetupContext,
  };
};
