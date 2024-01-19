import React, { FC, useMemo } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme, useTheme } from '@mui/material';

const useStyles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    px: 3,
    py: 2
  },
});

interface IPageProps {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

export const Page: FC<IPageProps> = ({ sx, children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const boxStyles = useMemo(() => ({ ...styles.root, ...sx || {} }), [styles.root, sx]);

  return (<Box sx={boxStyles}>{children}</Box>);
};
