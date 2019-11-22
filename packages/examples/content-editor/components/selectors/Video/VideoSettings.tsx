import React from 'react';
import {useNode} from 'craftjs';
import { ToolbarSection, ToolbarItem } from "../../editor"
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Divider, Typography, Chip, TextField } from '@material-ui/core'
import { ToolbarRadio } from '../../editor/Toolbar/ToolbarRadio';

export const VideoSettings = () => {
  const { width, height, actions: { setProp } } = useNode((node) => ({ width: node.data.props.width || 0, height: node.data.props.height || 0 }));

  return (
    <React.Fragment>
      <ToolbarSection
        title="Youtube">
          <ToolbarItem full={true} propKey="videoId" type="text" label="Video ID" />
      </ToolbarSection>
    </React.Fragment>
  );
}
