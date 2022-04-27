import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function ExampleModal({ open, setOpen }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <Typography variant="h6" component="div">
            Examples
          </Typography>
          <DialogContentText>
            Three examples have been included with this tool: 
            <br />
            • A DPDA that checks there are a number of a's followed by the same number of b's.
            <br />
            • A DPDA that ensures there is an equal number of  a's and b's.
            <br />
            • A DPDA that accepts any word followed by a 'c' character and then the reverse of the initial word.
            <br /><br />
            Select one from the dropdown to play with it!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}