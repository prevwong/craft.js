import React from 'react';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Divider, Typography, Chip } from '@material-ui/core'
import { useNode } from 'craftjs';

export const SettingsPanel = ({title, props, summary, children}: any) => {
  const {nodeProps} = useNode((node) => ({
    nodeProps: props.reduce((res: any, key: any) => {
      res[key] = node.data.props[key] || null; 
      return res;
    }, {})
  }));
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary>
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={4}>
            <h5 className='text-sm text-left font-medium text-dark-blue'>{title}</h5>
          </Grid>
          <Grid item xs={8}>
            <h5 className='text-sm text-right text-dark-blue'>{
              summary(
                props.reduce((acc: any, key: any) => {
                  acc[key] = nodeProps[key];
                  return acc;
                }, {})
              )
            }</h5>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ padding: "0px 24px 20px" }}>
        <Divider />
        <Grid container alignItems="center" spacing={1}>
          {children}
        </Grid>
      </ExpansionPanelDetails>

    </ExpansionPanel>
  )
}