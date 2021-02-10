import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Grid, Typography } from '@material-ui/core';
import { version } from '../package.json';

type InfoDialogProps = {
  open: boolean;
  setOpen: (v: boolean) => unknown;
};

export default function InfoDialog(props: InfoDialogProps) {
  const { open, setOpen } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent style={{ overflow: 'hidden' }}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <img
              style={{ width: '175px', margin: '15px 30px 20px 30px' }}
              src="../resources/icon.ico"
              alt="correctinator"
            />
          </Grid>
          <Grid item style={{ marginBottom: '10px' }}>
            <Typography variant="h6">{`correctinator v${version}`}</Typography>
          </Grid>
          <Grid item style={{ marginBottom: '20px' }}>
            <Typography>by Michael Kölle</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
