import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

export const LoadingPage = ({ sx }: { sx?: SxProps<Theme> }) => (
  <Grid container alignItems="center" justifyContent="center" sx={styles.root}>
    <CircularProgress sx={sx} size={50} />
  </Grid>
);