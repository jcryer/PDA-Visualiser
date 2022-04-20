import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({ open, setOpen, addTransition, params }) {

    const [input, setInput] = useState("");
    const [inStack, setInStack] = useState("");
    const [outStack, setOutStack] = useState("");
    
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    addTransition(params, input, inStack, outStack);
    setOpen(false);
    setInput("");
    setInStack("");
    setOutStack("");
  }

  return (
    <div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Transition</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter one or more symbols that must be at the top of the remaining input
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Required Input Symbol"
            type="text"
            fullWidth
            variant="standard"
            value={input}
            inputProps={{ maxLength: 1 }}
            onChange={(e) => setInput(e.target.value)}
          />
         <DialogContentText>
            Enter zero or more symbols that must be at the top of the stack
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Required Stack Symbol"
            type="text"
            fullWidth
            variant="standard"
            value={inStack}
            inputProps={{ maxLength: 1 }}
            onChange={(e) => setInStack(e.target.value)}
          />
         <DialogContentText>
            Enter zero or more symbols that will replace any popped symbols from the stack
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Replaced Stack Symbol(s)"
            type="text"
            fullWidth
            variant="standard"
            value={outStack}
            onChange={(e) => setOutStack(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Transition</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}