import React from 'react';
import {useNode} from 'craftjs';
import { ToolbarSection, ToolbarItem } from "../../editor"
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Divider, Typography, Chip, TextField } from '@material-ui/core'
import { ToolbarRadio } from '../../editor/Toolbar/ToolbarRadio';

export const VideoSettings = () => {

  return (
    <React.Fragment>
      <ToolbarSection
        title="Youtube">
          <ToolbarItem full={true} propKey="videoId" type="text" label="Video ID" />
      </ToolbarSection>
    </React.Fragment>
  );
}
