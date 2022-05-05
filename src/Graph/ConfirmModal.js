import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Typography } from '@mui/material';

export default function ConfirmModal({ open, setOpen, reset }) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    reset();
    setOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" component="div">
            Are you sure you want to do that?
          </Typography>
          <DialogContentText>
            All un-exported changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}