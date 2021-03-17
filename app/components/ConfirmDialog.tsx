import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText } from '@material-ui/core';

type ConfirmDialogProps = {
  title: string;
  text: string;
  open: boolean;
  setOpen: (v: boolean) => unknown;
  onConfirm: () => unknown;
  onReject: () => unknown;
  onCancel?: undefined | (() => unknown);
};

const defaultProps: Partial<ConfirmDialogProps> = {
  onCancel: undefined,
};

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { title, text, open, setOpen, onConfirm, onReject, onCancel } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      disableBackdropClick
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="primary"
          autoFocus
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            onReject();
          }}
          color="primary"
        >
          No
        </Button>
        {onCancel ? (
          <Button
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
            color="default"
          >
            Cancel
          </Button>
        ) : (
          <></>
        )}
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.defaultProps = defaultProps;
export default ConfirmDialog;
