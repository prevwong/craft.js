import { useNode } from '@craftjs/core';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid2 as Grid,
} from '@mui/material';
import React from 'react';

export const ToolbarSection = ({ title, props, summary, children }: any) => {
  const { nodeProps } = useNode((node) => ({
    nodeProps:
      props &&
      props.reduce((res: any, key: any) => {
        res[key] = node.data.props[key] || null;
        return res;
      }, {}),
  }));
  return (
    <Accordion
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        '&:before': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
        '&.Mui-expanded': {
          margin: '0 0',
          minHeight: '40px',
          '&:before': {
            opacity: '1',
          },
          '& + .MuiExpansionPanel-root:before ': {
            display: 'block',
          },
        },
      }}
    >
      <AccordionSummary
        sx={{
          minHeight: '36px',
          padding: 0,
          outline: 'none!important',
        }}
      >
        <div className="px-6 w-full">
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid size={{ xs: 4 }}>
              <h5 className="text-sm text-light-gray-1 text-left font-medium text-dark-gray">
                {title}
              </h5>
            </Grid>
            {summary && props ? (
              <Grid size={{ xs: 8 }}>
                <h5 className="text-light-gray-2 text-sm text-right text-dark-blue">
                  {summary(
                    props.reduce((acc: any, key: any) => {
                      acc[key] = nodeProps[key];
                      return acc;
                    }, {})
                  )}
                </h5>
              </Grid>
            ) : null}
          </Grid>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0px 24px 20px' }}>
        <Grid container spacing={1}>
          {children}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
